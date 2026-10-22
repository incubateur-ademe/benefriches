// ADW runner: `node adws/run.ts run BEN-x` takes one Linear issue to a reviewed, pushed branch.
// It owns the sequence, the correction and review budgets, git push, the run directory, transcripts and
// the report. What each agent step does lives in .claude/commands/adw-*.md, never here.
import { spawn } from "node:child_process";
import { createHash, randomBytes } from "node:crypto";
import { existsSync } from "node:fs";
import { copyFile, mkdir, open, readdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import { query, type HookCallback, type McpServerConfig } from "@anthropic-ai/claude-agent-sdk";

import { envDown, envUp, freeSlot, type EnvUpResult } from "./env.ts";
import { linearCli, type Linear } from "./linear.ts";

export type Outcome = "ready" | "needs-human" | "blocked" | "env-failed";
export type RunResult = { outcome: Outcome | "refused"; reason: string; runDir: string };

export type SessionRequest = {
  step: string;
  prompt: string;
  cwd: string;
  transcript: string;
  mcpServers: Record<string, McpServerConfig>;
  resume?: string;
};
export type SessionResult = {
  sessionId: string;
  status: "done" | "timeout" | "error";
  text: string;
  costUsd: number;
  durationMs: number;
};
export type Agent = (request: SessionRequest) => Promise<SessionResult>;
export type Shell = (
  cwd: string,
  cmd: string,
  args: string[],
) => Promise<{ ok: boolean; output: string }>;
export type Env = {
  up(worktree: string, slot: number): Promise<EnvUpResult>;
  down(worktree: string, slot: number): Promise<void>;
};
export type Deps = {
  linear: Linear;
  agent: Agent;
  sh: Shell;
  env: Env;
  /** Root of the run directories, outside any worktree. */
  runsDir: string;
  /** The checkout the runner is started from. */
  repo: string;
  log: (line: string) => void;
};
export type RunOptions = { slot?: number; base: string };

export const OUTCOME_PREFIX = "ADW outcome:";
const REPORT_HEADING = "## ADW report";
const MAX_CORRECTIONS = 2;
const MAX_REVIEW_ROUNDS = 2;
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;
const MAX_CHECK_OUTPUT = 200_000;
const MCP_DIR = fileURLToPath(new URL("mcp/", import.meta.url));

type Issue = {
  identifier: string;
  title: string;
  url: string;
  branchName: string;
  state: { name: string; type: string };
  project: { name: string } | null;
};
type Relation = {
  identifier: string;
  state: { name: string; type: string };
  project: string | null;
};
type Snapshot = { issue: Issue; comments: { body: string }[]; blockedBy: Relation[] };
// The verdicts /adw-review and /adw-qa end with; their shape is defined in those commands.
type Finding = { title: string; location: string; detail: string };
type ReviewVerdict = { approve: boolean; blockers?: Finding[]; techDebt?: Finding[] };
type QaVerdict = { pass: boolean; failures?: { scenario: string; observed: string }[] };

const readJson = async <T>(path: string): Promise<T> => JSON.parse(await readFile(path, "utf8"));
const readOptional = (path: string) => readFile(path, "utf8").catch(() => "");

async function readSnapshot(dir: string): Promise<Snapshot> {
  const relations = await readJson<{ blockedBy: Relation[] }>(join(dir, "relations.json"));
  return {
    issue: await readJson<Issue>(join(dir, "issue.json")),
    comments: await readJson<{ body: string }[]>(join(dir, "comments.json")),
    blockedBy: relations.blockedBy,
  };
}

/** Why the issue can't run now, or undefined when it can. */
export function refusal({ issue, comments, blockedBy }: Snapshot): string | undefined {
  const retry =
    issue.state.name === "In Progress" && comments.some((c) => c.body.startsWith(OUTCOME_PREFIX));
  if (!["backlog", "unstarted"].includes(issue.state.type) && !retry) {
    return `${issue.identifier} is ${issue.state.name}: only Backlog or Todo issues, or In Progress issues with a previous "${OUTCOME_PREFIX}" comment, can run`;
  }
  // A blocker In Review in the same project is satisfied: its commits are on the task branch.
  const open = blockedBy.filter(
    (b) =>
      b.state.type !== "completed" &&
      !(b.state.name === "In Review" && issue.project && b.project === issue.project.name),
  );
  if (open.length) {
    return `blocked by ${open.map((b) => `${b.identifier} (${b.state.name})`).join(", ")}`;
  }
  return undefined;
}

/** What the spec depends on: a rerun reuses the previous spec only when this is unchanged. */
async function planInputsHash(dir: string): Promise<string> {
  // Linear's updatedAt moves on every claim and comment, including the runner's own,
  // so compare the content the planner reads instead, minus the runner's comments.
  const comments = (await readJson<{ body: string }[]>(join(dir, "comments.json"))).filter(
    (c) => !c.body.startsWith(OUTCOME_PREFIX) && !c.body.startsWith(REPORT_HEADING),
  );
  const parts = [
    await readOptional(join(dir, "issue.md")),
    await readOptional(join(dir, "DESIGN.md")),
    await readOptional(join(dir, "attachments.json")),
    JSON.stringify(comments),
  ];
  return createHash("sha256").update(parts.join("\0")).digest("hex");
}

/** The latest previous spec of this issue, if it was planned from the same inputs. */
async function reusableSpec(issueDir: string, runDir: string, inputs: string) {
  const runs = (await readdir(issueDir))
    .map((name) => join(issueDir, name))
    .filter((d) => d !== runDir);
  for (const dir of runs.sort().reverse()) {
    const spec = await readOptional(join(dir, "spec.md"));
    if (!spec) continue;
    const previousInputs = await readOptional(join(dir, "plan-inputs.sha256"));
    return previousInputs === inputs && !spec.startsWith("BLOCKED")
      ? join(dir, "spec.md")
      : undefined;
  }
  return undefined;
}

const isBlocked = (text: string) => text.trimStart().startsWith("BLOCKED");
/** The last `json` code block of a session's final message, or undefined. */
export function verdict<T>(text: string): T | undefined {
  const block = [...text.matchAll(/```json\s*\n([\s\S]*?)```/g)].at(-1);
  try {
    return block && JSON.parse(block[1]);
  } catch {
    return undefined;
  }
}
/** QA runs only when the spec's Scenarios section exists and does not start with `None`. */
export function hasScenarios(spec: string) {
  const section =
    spec
      .split(/^## Scenarios[ \t]*$/m)[1]
      ?.split(/^## /m)[0]
      .trim() ?? "";
  return !/^(none\b|$)/i.test(section);
}
const bullets = (items: string[]) => items.map((item) => `- ${item}`).join("\n");
const cut = (output: string, path: string) =>
  output.length <= MAX_CHECK_OUTPUT
    ? output
    : `[${output.length - MAX_CHECK_OUTPUT} characters cut; full output: ${path}]\n${output.slice(-MAX_CHECK_OUTPUT)}`;
const seq = (n: number) => String(n).padStart(2, "0");
const minutes = (ms: number) => `${(ms / 60000).toFixed(1)} min`;

export async function runIssue(id: string, options: RunOptions, deps: Deps): Promise<RunResult> {
  const { linear, sh, log } = deps;
  const started = Date.now();
  const issueDir = join(deps.runsDir, id);
  await mkdir(issueDir, { recursive: true });
  // A new directory per run, never reused: mkdir without `recursive` fails if it exists.
  const runId = `${new Date().toISOString().replaceAll(":", "-")}-${randomBytes(3).toString("hex")}`;
  const runDir = join(issueDir, runId);
  await mkdir(runDir);
  await mkdir(join(runDir, "transcripts"));
  await mkdir(join(runDir, "checks"));
  log(`run directory: ${runDir}`);

  const git = async (cwd: string, ...args: string[]) => {
    const result = await sh(cwd, "git", args);
    if (!result.ok) throw new Error(`git ${args.join(" ")} failed:\n${result.output}`);
    return result.output.trim();
  };

  // --- Intake: everything before `claim` leaves Linear untouched.
  await linear.snapshot(id, runDir);
  const snapshot = await readSnapshot(runDir);
  const { issue } = snapshot;
  const branch = issue.project ? issue.project.name : issue.branchName;
  const mainCheckout = dirname(
    await git(deps.repo, "rev-parse", "--path-format=absolute", "--git-common-dir"),
  );
  const worktree = join(mainCheckout, "trees", branch.replaceAll("/", "-"));
  const remoteBranch = (
    await sh(deps.repo, "git", ["ls-remote", "--exit-code", "--heads", "origin", branch])
  ).ok;
  const localBranch = (
    await sh(deps.repo, "git", ["rev-parse", "--verify", "--quiet", `refs/heads/${branch}`])
  ).ok;

  let refused = refusal(snapshot);
  if (!refused && remoteBranch) await git(deps.repo, "fetch", "origin", branch);
  if (!refused && remoteBranch && localBranch) {
    const upToDate = ["merge-base", "--is-ancestor", `origin/${branch}`, branch];
    if (!(await sh(deps.repo, "git", upToDate)).ok)
      refused = `branch ${branch} is behind origin/${branch}: pull it first`;
  }
  if (refused) {
    await writeFile(join(runDir, "refused.md"), `${refused}\n`);
    log(`refused: ${refused}`);
    return { outcome: "refused", reason: refused, runDir };
  }
  await linear.claim(id);

  const sessions: (SessionResult & { step: string; transcript: string })[] = [];
  const flakes: { check: string; log: string }[] = [];
  let slot: number | undefined;
  let stackUp = false;
  let startSha = "";
  let corrections = 0;
  let specSource = "planned";
  let buildReport = "";
  let checkSeq = 0;
  let sessionSeq = 0;
  let reviewRounds = 0;
  let review: ReviewVerdict | undefined;
  let qaStatus = "not reached";
  const followUps: string[] = [];

  async function session(step: string, prompt: string, mcp: string | undefined, resume?: string) {
    const mcpServers = mcp
      ? (await readJson<{ mcpServers: Record<string, McpServerConfig> }>(join(MCP_DIR, mcp)))
          .mcpServers
      : {};
    // A session that times out is resumed once, with the same prompt.
    for (let attempt = 1; ; attempt++) {
      const transcript = join(runDir, "transcripts", `${seq(++sessionSeq)}-${step}.jsonl`);
      log(`${step}: session ${sessionSeq}${resume ? ` (resuming ${resume})` : ""}`);
      const request = { step, prompt, cwd: worktree, transcript, mcpServers, resume };
      const result = await deps.agent(request);
      sessions.push({ ...result, step, transcript });
      if (result.status !== "timeout" || attempt === 2) return result;
      resume = result.sessionId;
    }
  }

  async function check(name: string, cmd: string, args: string[]) {
    const result = await sh(worktree, cmd, args);
    const logFile = join(runDir, "checks", `${seq(++checkSeq)}-${name}.log`);
    await writeFile(logFile, result.output);
    return { ...result, logFile, header: `$ ${[cmd, ...args].join(" ")}` };
  }

  /** The acceptance check: verify, then the full e2e suite on a rebuilt stack. Returns failures. */
  async function acceptance(): Promise<string | undefined> {
    const failures: string[] = [];
    const suites: [string, string, string[]][] = [
      ["verify", "pnpm", ["verify"]],
      ["e2e", "pnpm", ["--filter", "e2e-tests", "test:headless"]],
    ];
    for (const [name, cmd, args] of suites) {
      if (name === "e2e") {
        // The stack must serve the code just built, from an empty database.
        const up = await deps.env.up(worktree, slot!);
        if (up.outcome !== "ready") {
          failures.push(`$ e2e stack up (${up.step}): ${up.command}\n${up.output}`);
          continue;
        }
      }
      const first = await check(name, cmd, args);
      if (first.ok) continue;
      const second = await check(name, cmd, args);
      if (second.ok) flakes.push({ check: name, log: first.logFile });
      else failures.push(`${second.header}\n${cut(second.output, second.logFile)}`);
    }
    return failures.length ? failures.join("\n\n") : undefined;
  }

  async function report(outcome: Outcome, reason: string) {
    const commits = startSha
      ? (await sh(worktree, "git", ["log", "--oneline", `${startSha}..HEAD`])).output.trim()
      : "";
    const cost = sessions.reduce((sum, s) => sum + s.costUsd, 0);
    const lines = [
      `${REPORT_HEADING}: ${id}`,
      "",
      `- Outcome: \`${outcome}\`${reason ? `: ${reason.split("\n")[0]}` : ""}`,
      `- Branch: \`${branch}\`${outcome === "ready" ? " (pushed)" : ""}`,
      `- Spec: ${specSource}`,
      `- Corrections after the acceptance check: ${corrections}/${MAX_CORRECTIONS}`,
      `- Review: ${review ? `${review.blockers?.length ? "blockers remain" : "approved"} after ${reviewRounds}/${MAX_REVIEW_ROUNDS} rounds (\`${join(runDir, "review.md")}\`)` : "not reached"}`,
      `- QA: ${qaStatus}`,
      `- Flakes: ${flakes.length ? flakes.map((f) => `${f.check} (failed once, passed on re-run; \`${f.log}\`)`).join(", ") : "none"}`,
      `- Total cost: $${cost.toFixed(2)}, wall time: ${minutes(Date.now() - started)}`,
      `- Run directory: \`${runDir}\``,
      "",
      "### Commits",
      "",
      commits ? bullets(commits.split("\n")) : "None",
      "",
      "### Sessions",
      "",
      "| Step | Status | Time | Cost |",
      "| -- | -- | -- | -- |",
      ...sessions.map(
        (s) => `| ${s.step} | ${s.status} | ${minutes(s.durationMs)} | $${s.costUsd.toFixed(2)} |`,
      ),
    ];
    if (followUps.length) lines.push("", "### Tech-debt follow-ups", "", bullets(followUps));
    if (buildReport) lines.push("", "### Build report", "", buildReport);
    const path = join(runDir, "report.md");
    await writeFile(path, `${lines.join("\n")}\n`);
    return path;
  }

  async function end(outcome: Outcome, reason = ""): Promise<RunResult> {
    log(`outcome: ${outcome}${reason ? ` (${reason.split("\n")[0]})` : ""}`);
    const reportPath = await report(outcome, reason);
    if (outcome === "ready") {
      await linear.comment(id, reportPath);
      await linear.review(id);
    } else {
      const path = join(runDir, "outcome.md");
      await writeFile(
        path,
        `${OUTCOME_PREFIX} ${outcome}\n\n${reason}\n\nRun directory: \`${runDir}\`\n`,
      );
      await linear.comment(id, path);
    }
    return { outcome, reason, runDir };
  }

  try {
    // --- Env up: worktree, port slot, stack. Any failure ends the run before an agent starts.
    try {
      if (!existsSync(worktree)) {
        const add = localBranch
          ? [worktree, branch]
          : remoteBranch
            ? ["--track", "-b", branch, worktree, `origin/${branch}`]
            : ["-b", branch, worktree, options.base];
        await git(deps.repo, "worktree", "add", ...add);
        await sh(worktree, join(worktree, "scripts/prime-worktree.sh"), [worktree]);
      }
      const current = await git(worktree, "branch", "--show-current");
      if (current !== branch) throw new Error(`${worktree} is on ${current}, expected ${branch}`);
      const dirty = await git(worktree, "status", "--porcelain", "--untracked-files=no");
      if (dirty) throw new Error(`${worktree} has uncommitted changes:\n${dirty}`);
      startSha = await git(worktree, "rev-parse", "HEAD");
      slot = options.slot ?? (await freeSlot(worktree));
    } catch (error) {
      return await end("env-failed", String(error instanceof Error ? error.message : error));
    }
    log(`worktree ${worktree}, branch ${branch}, slot ${slot}`);
    const up = await deps.env.up(worktree, slot);
    if (up.outcome !== "ready") {
      return await end("env-failed", `${up.step}: ${up.command}\n\n${up.output}`);
    }
    stackUp = true;

    // --- Plan
    const spec = join(runDir, "spec.md");
    const inputs = await planInputsHash(runDir);
    await writeFile(join(runDir, "plan-inputs.sha256"), inputs);
    const previous = await reusableSpec(issueDir, runDir, inputs);
    if (previous) {
      await copyFile(previous, spec);
      specSource = `reused \`${previous}\` (issue and DESIGN unchanged)`;
    } else {
      const plan = await session("plan", `/adw-plan ${runDir}`, "plan.json");
      if (plan.status !== "done")
        return await end("needs-human", `plan session ${plan.status}:\n${plan.text}`);
    }
    const specText = await readOptional(spec);
    if (!specText) return await end("needs-human", `the plan session wrote no ${spec}`);
    if (isBlocked(specText)) return await end("blocked", specText.trim());

    // --- Build, then the acceptance check, then review. Check failures and review blockers go
    // back to the same build session; a fix for blockers goes through the acceptance check again.
    let build = await session("build", `/adw-build ${spec}`, undefined);
    for (;;) {
      buildReport = build.text.trim();
      if (build.status !== "done")
        return await end("needs-human", `build session ${build.status}:\n${build.text}`);
      if (isBlocked(build.text)) return await end("blocked", build.text.trim());
      const failures = await acceptance();
      if (failures) {
        if (corrections === MAX_CORRECTIONS) {
          return await end(
            "needs-human",
            `acceptance check still red after ${MAX_CORRECTIONS} corrections:\n${failures.slice(0, 2000)}`,
          );
        }
        corrections++;
        build = await session(
          `build-correction-${corrections}`,
          failures,
          undefined,
          build.sessionId,
        );
        continue;
      }

      reviewRounds++;
      const reviewed = await session("review", `/adw-review ${spec} ${startSha}`, undefined);
      review = verdict<ReviewVerdict>(reviewed.text);
      if (reviewed.status !== "done" || !review) {
        return await end(
          "needs-human",
          `review: ${reviewed.status}, no verdict:\n${reviewed.text}`,
        );
      }
      // Blockers decide, whatever `approve` says: tech debt alone never goes back to the builder.
      if (!review.blockers?.length) break;
      if (reviewRounds === MAX_REVIEW_ROUNDS) {
        const blockers = review.blockers.map((b) => `${b.title} (\`${b.location}\`): ${b.detail}`);
        return await end(
          "needs-human",
          `review blockers remain after ${MAX_REVIEW_ROUNDS} rounds:\n${bullets(blockers)}`,
        );
      }
      // Only the blockers, verbatim: tech debt becomes follow-up issues at finish.
      const fix = JSON.stringify({ blockers: review.blockers }, null, 2);
      build = await session(`build-review-${reviewRounds}`, fix, undefined, build.sessionId);
    }

    // --- QA, only when the spec has user-visible scenarios.
    if (!hasScenarios(specText)) qaStatus = "skipped: the spec has no Scenarios";
    else {
      const walked = await session("qa", `/adw-qa ${spec}`, "playwright.json");
      const qa = verdict<QaVerdict>(walked.text);
      if (walked.status !== "done" || !qa) {
        qaStatus = `no verdict (session ${walked.status})`;
        return await end("needs-human", `QA: ${walked.status}, no verdict:\n${walked.text}`);
      }
      const failed = (qa.failures ?? []).map((f) => `${f.scenario}: ${f.observed}`);
      qaStatus = `${qa.pass && !failed.length ? "passed" : "failed"} (\`${join(runDir, "qa.md")}\`)`;
      if (!qa.pass || failed.length) {
        return await end("needs-human", `QA failed (details in qa.md):\n${bullets(failed)}`);
      }
    }

    // --- Finish
    const push = await sh(worktree, "git", ["push", "-u", "origin", branch]);
    if (!push.ok) return await end("needs-human", `git push failed:\n${push.output}`);
    for (const [n, debt] of (review?.techDebt ?? []).entries()) {
      const body = join(runDir, `follow-up-${n + 1}.md`);
      await writeFile(body, `Follow-up from ${id}\n\n\`${debt.location}\`\n\n${debt.detail}\n`);
      const created = await linear
        .issueCreate(issue.project?.name, debt.title, body)
        .catch((e) => `not filed (${String(e.message).split("\n")[0]})`);
      followUps.push(`${created}: ${debt.title}`);
    }
    return await end("ready");
  } catch (error) {
    return await end(
      "needs-human",
      `runner error: ${error instanceof Error ? error.stack : error}`,
    );
  } finally {
    if (stackUp) await deps.env.down(worktree, slot!).catch((e) => log(`env down failed: ${e}`));
  }
}

// --- Real adapters

/** Agents never push, merge or open pull requests: the runner pushes, a human does the rest. */
export function deniedCommand(command: string): boolean {
  const gitOptions = String.raw`(?:-[Cc]\s+\S+\s+|--?[\w-]+(?:=\S+)?\s+)*`;
  return (
    new RegExp(String.raw`\bgit\s+${gitOptions}(?:push|merge)(?![\w-])`).test(command) ||
    /\bgh\s+pr\b/.test(command)
  );
}

const denyGitEscapes: HookCallback = async (input) => {
  const command = (input as { tool_input?: { command?: unknown } }).tool_input?.command;
  if (typeof command !== "string" || !deniedCommand(command)) return {};
  return {
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: "push, merge and pull requests are reserved to the ADW runner",
    },
  };
};

function agentEnv() {
  const env = { ...process.env };
  delete env.LINEAR_TOKEN;
  return env;
}

export const sdkAgent: Agent = async (request) => {
  // `wx`: a transcript is never overwritten.
  const transcript = await open(request.transcript, "wx");
  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), SESSION_TIMEOUT_MS);
  const started = Date.now();
  const result: SessionResult = {
    sessionId: request.resume ?? "",
    status: "error",
    text: "",
    costUsd: 0,
    durationMs: 0,
  };
  try {
    const messages = query({
      prompt: request.prompt,
      options: {
        cwd: request.cwd,
        resume: request.resume,
        abortController: abort,
        settingSources: ["project"],
        permissionMode: "bypassPermissions",
        allowDangerouslySkipPermissions: true,
        disallowedTools: ["Bash(git push:*)", "Bash(git merge:*)", "Bash(gh pr:*)"],
        hooks: { PreToolUse: [{ matcher: "Bash", hooks: [denyGitEscapes] }] },
        strictMcpConfig: true,
        mcpServers: request.mcpServers,
        env: agentEnv(),
      },
    });
    for await (const message of messages) {
      await transcript.write(`${JSON.stringify(message)}\n`);
      if ("session_id" in message && message.session_id) result.sessionId = message.session_id;
      if (message.type === "result") {
        result.costUsd = message.total_cost_usd;
        result.status = message.is_error ? "error" : "done";
        result.text = message.subtype === "success" ? message.result : message.errors.join("\n");
      }
    }
  } catch (error) {
    result.status = abort.signal.aborted ? "timeout" : "error";
    result.text ||= String(error);
  } finally {
    clearTimeout(timer);
    await transcript.close();
  }
  return { ...result, durationMs: Date.now() - started };
};

/** Runs a command; stdout and stderr are interleaved as they arrive. */
export const shell: Shell = (cwd, cmd, args) =>
  new Promise((done) => {
    const child = spawn(cmd, args, { cwd, env: agentEnv() });
    const chunks: Buffer[] = [];
    child.stdout.on("data", (c: Buffer) => chunks.push(c));
    child.stderr.on("data", (c: Buffer) => chunks.push(c));
    child.on("error", (error) => done({ ok: false, output: String(error) }));
    child.on("close", (code) => done({ ok: code === 0, output: Buffer.concat(chunks).toString() }));
  });

async function main(argv: string[]) {
  const [command, id, ...rest] = argv;
  const flag = (name: string) => {
    const i = rest.indexOf(name);
    return i >= 0 ? rest[i + 1] : undefined;
  };
  if (command !== "run" || !id || !/^[A-Z]+-\d+$/.test(id)) {
    console.error("usage: node adws/run.ts run <ISSUE-ID> [--slot <0-99>] [--base <ref>]");
    process.exitCode = 2;
    return;
  }
  const slot = flag("--slot");
  const result = await runIssue(
    id,
    { slot: slot === undefined ? undefined : Number(slot), base: flag("--base") ?? "main" },
    {
      linear: await linearCli(),
      agent: sdkAgent,
      sh: shell,
      env: { up: envUp, down: envDown },
      runsDir: process.env.ADW_RUNS_DIR ?? join(homedir(), ".adw", "runs"),
      repo: fileURLToPath(new URL("..", import.meta.url)),
      log: (line) => console.log(`[adw ${new Date().toISOString().slice(11, 19)}] ${line}`),
    },
  );
  console.log(JSON.stringify(result, null, 2));
  process.exitCode = result.outcome === "ready" ? 0 : 1;
}

if (import.meta.main) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

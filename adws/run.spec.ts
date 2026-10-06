// Runner flow with scripted fake sessions, a fake Linear adapter and a fake shell:
// each outcome, the Linear calls it makes, the correction budget and the run directory.
import assert from "node:assert/strict";
import { mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, it } from "node:test";

import type { EnvUpResult } from "./env.ts";
import {
  deniedCommand,
  OUTCOME_PREFIX,
  runIssue,
  type Deps,
  type SessionRequest,
  type SessionResult,
} from "./run.ts";

const ID = "BEN-42";

type Fixture = {
  state: { name: string; type: string };
  project: string | null;
  description: string;
  comments: { body: string }[];
  blockedBy: {
    identifier: string;
    state: { name: string; type: string };
    project: string | null;
  }[];
};

const todo = { name: "Todo", type: "unstarted" };

function fakeWorld(runsDir: string) {
  const issue: Fixture = {
    state: todo,
    project: "my-task",
    description: "Do it.",
    comments: [],
    blockedBy: [],
  };
  const linearCalls: string[] = [];
  const comments: string[] = [];
  const sessions: SessionRequest[] = [];
  const shellCalls: string[] = [];
  const checks: Record<string, boolean[]> = { verify: [], e2e: [] };
  let envUp: EnvUpResult["outcome"] = "ready";
  let envUps = 0;
  let envDowns = 0;
  // What each session does, by step; default: plan writes a spec, build succeeds.
  const script: Record<string, (r: SessionRequest) => Promise<Partial<SessionResult>>> = {
    plan: async (r) => {
      await writeFile(join(r.prompt.replace("/adw-plan ", ""), "spec.md"), "# spec\n");
      return {};
    },
  };

  const deps: Deps = {
    runsDir,
    repo: "/repo",
    log: () => {},
    linear: {
      async snapshot(id, dir) {
        linearCalls.push(`snapshot ${id}`);
        const json = (name: string, value: unknown) =>
          writeFile(join(dir, name), JSON.stringify(value));
        await json("issue.json", {
          identifier: id,
          title: "Title",
          url: "https://example.test",
          branchName: "claude/ben-42-title",
          state: issue.state,
          project: issue.project && { name: issue.project },
        });
        await writeFile(join(dir, "issue.md"), issue.description);
        await json("comments.json", issue.comments);
        await json("relations.json", { blocks: [], blockedBy: issue.blockedBy, other: [] });
      },
      async claim(id) {
        linearCalls.push(`claim ${id}`);
      },
      async review(id) {
        linearCalls.push(`review ${id}`);
      },
      async comment(id, file) {
        linearCalls.push(`comment ${id}`);
        const body = readFileSync(file, "utf8");
        comments.push(body);
        issue.comments.push({ body });
      },
    },
    async agent(request) {
      sessions.push(request);
      await writeFile(request.transcript, "{}\n", { flag: "wx" });
      const step = request.step.replace(/-correction-\d+$/, "");
      const scripted = await (script[step]?.(request) ?? Promise.resolve({}));
      return {
        sessionId: `session-${sessions.length}`,
        status: "done",
        text: "built",
        costUsd: 0.5,
        durationMs: 1000,
        ...scripted,
      };
    },
    async sh(_cwd, cmd, args) {
      const line = [cmd, ...args].join(" ");
      shellCalls.push(line);
      if (line === "pnpm verify")
        return { ok: checks.verify.shift() ?? true, output: "verify output" };
      if (line.startsWith("pnpm --filter e2e-tests"))
        return { ok: checks.e2e.shift() ?? true, output: "e2e output" };
      if (line.includes("--git-common-dir")) return { ok: true, output: "/repo/.git\n" };
      if (line.startsWith("git ls-remote") || line.startsWith("git rev-parse --verify"))
        return { ok: false, output: "" };
      if (line === "git branch --show-current")
        return { ok: true, output: `${issue.project ?? "claude/ben-42-title"}\n` };
      if (line === "git rev-parse HEAD") return { ok: true, output: "abc123\n" };
      if (line.startsWith("git log")) return { ok: true, output: "def456 feat: do it\n" };
      return { ok: true, output: "" };
    },
    env: {
      async up() {
        envUps++;
        return envUp === "ready"
          ? { outcome: "ready", envFile: ".e2e-stack", vars: {} }
          : {
              outcome: "env-failed",
              step: "compose up",
              command: "docker compose up",
              output: "port 3011 taken",
            };
      },
      async down() {
        envDowns++;
      },
    },
  };

  return {
    deps,
    issue,
    linearCalls,
    comments,
    sessions,
    shellCalls,
    checks,
    script,
    failEnv: () => (envUp = "env-failed"),
    envCounts: () => ({ up: envUps, down: envDowns }),
    steps: () => sessions.map((s) => s.step),
  };
}

describe("adw run", () => {
  let runsDir: string;
  let world: ReturnType<typeof fakeWorld>;
  const run = () => runIssue(ID, { base: "main", slot: 7 }, world.deps);

  beforeEach(() => {
    runsDir = mkdtempSync(join(tmpdir(), "adw-runs-"));
    world = fakeWorld(runsDir);
  });
  afterEach(() => rmSync(runsDir, { recursive: true, force: true }));

  it("takes a ready issue to a pushed branch, a report comment and In Review", async () => {
    const result = await run();

    assert.equal(result.outcome, "ready");
    assert.deepEqual(world.linearCalls, [
      `snapshot ${ID}`,
      `claim ${ID}`,
      `comment ${ID}`,
      `review ${ID}`,
    ]);
    assert.deepEqual(world.steps(), ["plan", "build"]);
    assert.equal(world.sessions[0].prompt, `/adw-plan ${result.runDir}`);
    assert.equal(world.sessions[1].prompt, `/adw-build ${join(result.runDir, "spec.md")}`);
    assert.ok(Object.keys(world.sessions[0].mcpServers).includes("context7"));
    assert.deepEqual(world.sessions[1].mcpServers, {});
    assert.ok(world.shellCalls.includes("git push -u origin my-task"));
    assert.ok(world.shellCalls.includes("git worktree add -b my-task /repo/trees/my-task main"));
    assert.match(world.comments[0], /^## ADW report: BEN-42/);
    assert.match(world.comments[0], /def456 feat: do it/);
    assert.deepEqual(world.envCounts(), { up: 2, down: 1 });
    assert.deepEqual(readdirSync(join(result.runDir, "transcripts")), [
      "01-plan.jsonl",
      "02-build.jsonl",
    ]);
  });

  it("gives a standalone issue its own branch, named by Linear", async () => {
    world.issue.project = null;
    await run();
    assert.ok(world.shellCalls.includes("git push -u origin claude/ben-42-title"));
    assert.ok(world.shellCalls.some((c) => c.includes("/repo/trees/claude-ben-42-title")));
  });

  it("refuses to start when a blocker is not satisfied, without touching Linear", async () => {
    world.issue.blockedBy = [
      { identifier: "BEN-1", state: { name: "Done", type: "completed" }, project: "my-task" },
      { identifier: "BEN-2", state: { name: "In Review", type: "started" }, project: "my-task" },
      { identifier: "BEN-3", state: { name: "In Review", type: "started" }, project: "other" },
      { identifier: "BEN-4", state: todo, project: "my-task" },
    ];
    const result = await run();
    assert.equal(result.outcome, "refused");
    assert.equal(result.reason, "blocked by BEN-3 (In Review), BEN-4 (Todo)");
    assert.deepEqual(world.linearCalls, [`snapshot ${ID}`]);
    assert.deepEqual(world.sessions, []);
  });

  it("refuses an In Progress issue unless a previous run left an outcome comment", async () => {
    world.issue.state = { name: "In Progress", type: "started" };
    assert.equal((await run()).outcome, "refused");
    world.issue.comments.push({ body: `${OUTCOME_PREFIX} needs-human\n\nreason` });
    assert.equal((await run()).outcome, "ready");
  });

  it("ends env-failed before any agent session when env up fails", async () => {
    world.failEnv();
    const result = await run();
    assert.equal(result.outcome, "env-failed");
    assert.deepEqual(world.sessions, []);
    assert.deepEqual(world.linearCalls, [`snapshot ${ID}`, `claim ${ID}`, `comment ${ID}`]);
    assert.match(
      world.comments[0],
      /^ADW outcome: env-failed\n\ncompose up: docker compose up\n\nport 3011 taken/,
    );
    assert.match(world.comments[0], new RegExp(`Run directory: \`${result.runDir}\``));
  });

  it("ends blocked when the plan writes BLOCKED", async () => {
    world.script.plan = async (r) => {
      await writeFile(
        join(r.prompt.replace("/adw-plan ", ""), "spec.md"),
        "BLOCKED\n- the banner copy\n",
      );
      return {};
    };
    const result = await run();
    assert.equal(result.outcome, "blocked");
    assert.deepEqual(world.steps(), ["plan"]);
    assert.match(world.comments[0], /^ADW outcome: blocked\n\nBLOCKED\n- the banner copy/);
    assert.ok(!world.linearCalls.includes(`review ${ID}`));
  });

  it("resumes the same build session with the full failing output", async () => {
    world.checks.verify = [false, false, true];
    const result = await run();
    assert.equal(result.outcome, "ready");
    assert.deepEqual(world.steps(), ["plan", "build", "build-correction-1"]);
    const correction = world.sessions[2];
    assert.equal(correction.resume, "session-2");
    assert.equal(correction.prompt, "$ pnpm verify\nverify output");
    assert.match(world.comments[0], /Corrections after the acceptance check: 1\/2/);
  });

  it("ends needs-human after 2 failed corrections", async () => {
    world.checks.e2e = Array(6).fill(false);
    const result = await run();
    assert.equal(result.outcome, "needs-human");
    assert.deepEqual(world.steps(), ["plan", "build", "build-correction-1", "build-correction-2"]);
    assert.equal(world.sessions[3].resume, "session-3");
    assert.match(
      world.comments[0],
      /^ADW outcome: needs-human\n\nacceptance check still red after 2 corrections/,
    );
    assert.deepEqual(world.linearCalls, [`snapshot ${ID}`, `claim ${ID}`, `comment ${ID}`]);
  });

  it("reports a fail-then-pass suite as a flake without spending a correction", async () => {
    world.checks.e2e = [false, true];
    const result = await run();
    assert.equal(result.outcome, "ready");
    assert.deepEqual(world.steps(), ["plan", "build"]);
    assert.match(world.comments[0], /Flakes: e2e \(failed once, passed on re-run/);
    assert.match(world.comments[0], /Corrections after the acceptance check: 0\/2/);
  });

  it("ends blocked when the build reports a missing input", async () => {
    world.script.build = async () => ({ text: "BLOCKED\n- the endpoint contract" });
    assert.equal((await run()).outcome, "blocked");
  });

  it("resumes a timed-out session once, then gives up", async () => {
    let calls = 0;
    world.script.build = async () => (++calls <= 2 ? { status: "timeout" } : {});
    const result = await run();
    assert.equal(result.outcome, "needs-human");
    assert.deepEqual(world.steps(), ["plan", "build", "build"]);
    assert.equal(world.sessions[2].resume, "session-2");
    assert.equal(world.sessions[2].prompt, world.sessions[1].prompt);
  });

  it("creates a new run directory per run and re-plans only when the issue changed", async () => {
    world.script.build = async () => ({ status: "error", text: "crashed" });
    const first = await run();
    world.issue.state = { name: "In Progress", type: "started" };
    const second = await run();
    world.issue.description = "Do it differently.";
    const third = await run();

    assert.equal(new Set([first.runDir, second.runDir, third.runDir]).size, 3);
    assert.equal(readdirSync(join(runsDir, ID)).length, 3);
    // second reused the first spec (only the runner's own comment changed); third re-planned
    assert.deepEqual(world.steps(), ["plan", "build", "build", "plan", "build"]);
  });
});

describe("deniedCommand", () => {
  it("denies push, merge and pull requests, however they are spelled", () => {
    for (const command of [
      "git push",
      "git push -u origin main",
      "cd apps && git push --force",
      "git -C /repo push",
      "git -c user.name=x merge main",
      "gh pr create --fill",
      "echo ok; git merge --no-ff feat",
    ]) {
      assert.ok(deniedCommand(command), command);
    }
  });

  it("allows everything else", () => {
    for (const command of [
      "git status",
      "git merge-base --is-ancestor a b",
      "git log --oneline",
      "git commit -m 'feat: push notifications'",
      "gh issue list",
      "pnpm verify",
    ]) {
      assert.ok(!deniedCommand(command), command);
    }
  });
});

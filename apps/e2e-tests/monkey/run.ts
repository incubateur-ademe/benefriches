/**
 * Monkey agent: `pnpm --filter e2e-tests monkey` registers a fresh user on the target
 * webapp, then lets Claude Code (Sonnet) explore it as that user through Playwright MCP and
 * write down the scenarios it tried, while hard-error-detector.ts records the hard errors of
 * the browser. Everything lands in monkey-runs/<timestamp>/. See monkey/README.md.
 *
 * Exit code: 1 when the run found a hard error, 2 when the agent or the runner failed,
 * 0 otherwise: suspicions alone never fail the run.
 */

import { spawn } from "node:child_process";
import { appendFileSync, createWriteStream, existsSync, readFileSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import { createInterface } from "node:readline";

import { createTestUserData, createTestUserViaApi } from "../fixtures/auth.fixtures";
import { createMailInbox } from "../fixtures/mail-inbox/mail-inbox";
import { HARD_ERRORS_FILE_NAME, type HardErrorRecord } from "./hard-error-detector";
import {
  buildClaudeArgs,
  buildPlaywrightMcpConfig,
  readMonkeyConfig,
  type MonkeyConfig,
} from "./monkey-config";
import { drawRunPlan, formatRunPlan } from "./run-plan";
import { buildRunSummary } from "./run-summary";
import {
  buildScenarioLog,
  countHardErrors,
  exitCodeOf,
  parseHardErrorRecords,
  resolveStopReason,
  writeFileAtomically,
  type AgentEvent,
  type ScenarioLog,
  type StopReason,
} from "./scenario-log";

const E2E_TESTS_DIR = resolve(__dirname, "..");
const RUNS_DIR = join(E2E_TESTS_DIR, "monkey-runs");
// @playwright/mcp is a root devDependency, shared with the ADW QA step.
const PLAYWRIGHT_MCP_BIN = join(
  E2E_TESTS_DIR,
  "..",
  "..",
  "node_modules",
  ".bin",
  "playwright-mcp",
);
const HARD_ERROR_DETECTOR_PATH = join(__dirname, "hard-error-detector.ts");
// Relative to the run folder: screenshots and hard-errors.jsonl of the detector.
const HARD_ERRORS_DIR_NAME = "hard-errors";
const HARD_ERRORS_POLL_MS = 1_000;

type StreamEvent = {
  type?: string;
  subtype?: string;
  num_turns?: number;
  total_cost_usd?: number;
  message?: {
    content?: { type: string; text?: string; name?: string; input?: Record<string, unknown> }[];
  };
};

function log(message: string) {
  process.stdout.write(`[monkey] ${message}\n`);
}

/**
 * Registers a user whose address is a testmail.app address of this run, and saves its
 * session cookies as a Playwright storage state, so the agent starts logged in and never
 * needs the mailbox.
 */
async function registerUser(config: MonkeyConfig, storageStatePath: string): Promise<string> {
  const mailInbox = createMailInbox({ kind: "testmail", ...config.testmail });
  const email = await mailInbox.create("monkey");
  const { apiContext } = await createTestUserViaApi(
    config.baseUrl,
    createTestUserData("monkey", email),
  );
  try {
    const me = await apiContext.get("/api/auth/me");
    if (!me.ok()) {
      throw new Error(`The new user is not logged in: /api/auth/me responded ${me.status()}`);
    }
    await apiContext.storageState({ path: storageStatePath });
  } finally {
    await apiContext.dispose();
  }
  return email;
}

/** The texts and tool calls of an assistant message, stamped with the time it was received. */
function toAgentEvents(event: StreamEvent, timestamp: string): AgentEvent[] {
  if (event.type !== "assistant") return [];
  return (event.message?.content ?? []).flatMap((block): AgentEvent[] => {
    if (block.type === "text" && block.text) {
      return [{ kind: "text", timestamp, text: block.text }];
    }
    if (block.type === "tool_use") {
      return [
        { kind: "tool-call", timestamp, tool: block.name ?? "unknown", input: block.input ?? {} },
      ];
    }
    return [];
  });
}

/** Starts Claude Code and forwards each line of its stream-json output. */
function startClaude(options: {
  args: string[];
  cwd: string;
  transcriptPath: string;
  stderrPath: string;
  onEvent: (event: StreamEvent) => void;
}) {
  // The agent has no shell, but keep the testmail.app key out of its environment anyway.
  const env = { ...process.env };
  delete env.E2E_TESTMAIL_API_KEY;
  const child = spawn("claude", options.args, {
    cwd: options.cwd,
    env,
    stdio: ["ignore", "pipe", "pipe"],
  });

  const transcript = createWriteStream(options.transcriptPath);
  child.stderr.pipe(createWriteStream(options.stderrPath));
  createInterface({ input: child.stdout }).on("line", (line) => {
    transcript.write(`${line}\n`);
    try {
      options.onEvent(JSON.parse(line) as StreamEvent);
    } catch {
      // A non-JSON line is kept in the transcript only.
    }
  });

  const exited = new Promise<number | null>((resolvePromise, reject) => {
    child.on("error", reject);
    child.on("close", (code) => {
      transcript.end();
      resolvePromise(code);
    });
  });
  return { stop: () => child.kill("SIGTERM"), exited };
}

/** The scenarios the agent wrote down, in order: every text it wrote between tool calls. */
function buildNarrative(scenarioLog: ScenarioLog, agentEvents: AgentEvent[]): string {
  const texts = agentEvents.flatMap((event) => (event.kind === "text" ? [event.text.trim()] : []));
  const stoppedBy =
    scenarioLog.run.status === "finished" ? scenarioLog.run.stopReason : "still running";
  return `# Monkey run narrative\n\nStopped by: ${stoppedBy}\n\n## Plan\n\n${formatRunPlan(scenarioLog.plan)}\n\n${texts.join("\n\n")}\n`;
}

async function main() {
  const config = readMonkeyConfig();
  const { budgets } = config;
  const runId = new Date().toISOString().replaceAll(":", "-");
  const runDir = join(RUNS_DIR, runId);
  const hardErrorsDir = join(runDir, HARD_ERRORS_DIR_NAME);
  const paths = {
    runDir,
    storageStatePath: join(runDir, "storage-state.json"),
    playwrightOutputDir: join(runDir, "playwright"),
    hardErrorDetectorPath: HARD_ERROR_DETECTOR_PATH,
  };
  await mkdir(paths.playwrightOutputDir, { recursive: true });
  await mkdir(hardErrorsDir, { recursive: true });
  log(`seed: ${config.seed} (replay this run with MONKEY_SEED=${config.seed})`);
  log(`run folder: ${runDir}`);

  const plan = drawRunPlan(config.seed);
  await writeFile(join(runDir, "plan.json"), JSON.stringify(plan, null, 2));
  log(
    `plan: ${plan.persona}, ${plan.siteNature}, ${plan.projectType}, ${plan.creationMode}, quirks: ${plan.quirks.join(", ")}`,
  );

  // The run state: the scenario log and the summary are rebuilt from it after every change,
  // so a run killed at any point leaves both, valid.
  const startedAt = new Date().toISOString();
  const agentEvents: AgentEvent[] = [];
  let hardErrorRecords: HardErrorRecord[] = [];
  let userEmail: string | null = null;
  let result: StreamEvent | undefined;
  let run: ScenarioLog["run"] = { status: "running" };

  function persist(): ScenarioLog {
    const scenarioLog = buildScenarioLog({
      runId,
      baseUrl: config.baseUrl,
      userEmail,
      plan,
      budgets,
      startedAt,
      updatedAt: new Date().toISOString(),
      run,
      usage: { turns: result?.num_turns ?? null, costUsd: result?.total_cost_usd ?? null },
      agentEvents,
      hardErrorRecords,
      screenshotDir: HARD_ERRORS_DIR_NAME,
    });
    writeFileAtomically(
      join(runDir, "scenarios.json"),
      `${JSON.stringify(scenarioLog, null, 2)}\n`,
    );
    writeFileAtomically(join(runDir, "summary.md"), buildRunSummary(scenarioLog));
    return scenarioLog;
  }

  function readHardErrors(): boolean {
    const path = join(hardErrorsDir, HARD_ERRORS_FILE_NAME);
    if (!existsSync(path)) return false;
    const records = parseHardErrorRecords(readFileSync(path, "utf8"));
    if (records.length === hardErrorRecords.length) return false;
    for (const record of records.slice(hardErrorRecords.length)) {
      if (record.kind === "hard-error") {
        log(`hard error: [${record.hardError.severity}] ${record.hardError.message}`);
      }
    }
    hardErrorRecords = records;
    return true;
  }

  persist();
  userEmail = await registerUser(config, paths.storageStatePath);
  log(`registered and logged in as ${userEmail}`);

  const playwrightConfigPath = join(runDir, "playwright-mcp.config.json");
  await writeFile(
    playwrightConfigPath,
    JSON.stringify(buildPlaywrightMcpConfig(config.baseUrl, paths, config.headed), null, 2),
  );
  const mcpConfigPath = join(runDir, "mcp.json");
  await writeFile(
    mcpConfigPath,
    JSON.stringify(
      {
        mcpServers: {
          playwright: {
            command: PLAYWRIGHT_MCP_BIN,
            args: ["--config", playwrightConfigPath],
            // Read by hard-error-detector.ts, in the MCP server process.
            env: { MONKEY_TARGET_ORIGIN: config.baseUrl, MONKEY_HARD_ERRORS_DIR: hardErrorsDir },
          },
        },
      },
      null,
      2,
    ),
  );

  const [promptTemplate, glossary] = await Promise.all([
    readFile(join(__dirname, "prompt.md"), "utf8"),
    readFile(join(__dirname, "glossary.md"), "utf8"),
  ]);
  const prompt = promptTemplate
    .replace("{{GLOSSARY}}", glossary)
    .replace("{{RUN_PLAN}}", formatRunPlan(plan))
    .replaceAll("{{MAX_TURNS}}", String(budgets.maxTurns))
    .replaceAll("{{TIMEOUT_MINUTES}}", String(budgets.timeoutMs / 60_000))
    .replaceAll("{{BASE_URL}}", config.baseUrl);

  log(
    `starting the agent on ${config.baseUrl}: stops after ${budgets.maxTurns} turns, ${budgets.timeoutMs / 60_000} min, $${budgets.maxCostUsd} or ${budgets.maxHardErrors} hard errors, whichever comes first`,
  );
  const claude = startClaude({
    args: buildClaudeArgs({ prompt, mcpConfigPath, budgets }),
    cwd: runDir,
    transcriptPath: join(runDir, "transcript.jsonl"),
    stderrPath: join(runDir, "claude-stderr.log"),
    onEvent: (event) => {
      if (event.type === "result") result = event;
      const events = toAgentEvents(event, new Date().toISOString());
      for (const agentEvent of events) {
        if (agentEvent.kind === "tool-call") log(`tool call: ${agentEvent.tool}`);
      }
      agentEvents.push(...events);
      if (events.length > 0 || event.type === "result") persist();
    },
  });

  let forcedStop: StopReason | null = null;
  function stopAgent(reason: StopReason, message: string) {
    if (forcedStop) return;
    forcedStop = reason;
    log(`${message}: stopping the agent`);
    claude.stop();
  }
  const timer = setTimeout(() => {
    stopAgent("time-limit", `time limit of ${budgets.timeoutMs / 60_000} min reached`);
  }, budgets.timeoutMs);
  const hardErrorsPoll = setInterval(() => {
    if (!readHardErrors()) return;
    persist();
    if (countHardErrors(hardErrorRecords) >= budgets.maxHardErrors) {
      stopAgent("hard-error-limit", `${budgets.maxHardErrors} hard errors found`);
    }
  }, HARD_ERRORS_POLL_MS);
  const onSignal = () => {
    stopAgent("interrupted", "interrupted");
  };
  process.once("SIGINT", onSignal);
  process.once("SIGTERM", onSignal);

  const exitCode = await claude.exited.finally(() => {
    clearTimeout(timer);
    clearInterval(hardErrorsPoll);
    process.off("SIGINT", onSignal);
    process.off("SIGTERM", onSignal);
  });

  readHardErrors();
  run = {
    status: "finished",
    stopReason: resolveStopReason({ forcedStop, resultSubtype: result?.subtype, exitCode }),
    endedAt: new Date().toISOString(),
  };
  const scenarioLog = persist();
  await writeFile(join(runDir, "narrative.md"), buildNarrative(scenarioLog, agentEvents));
  if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, buildRunSummary(scenarioLog));
  }

  log(
    `stopped by: ${run.stopReason}. ${scenarioLog.hardErrorCount} hard errors, ${scenarioLog.suspicionCount} suspicions, ${scenarioLog.scenarios.length} scenarios. Summary: ${join(basename(RUNS_DIR), runId, "summary.md")}`,
  );
  process.exitCode = exitCodeOf(scenarioLog);
}

main().catch((error: unknown) => {
  process.stderr.write(`[monkey] ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 2;
});

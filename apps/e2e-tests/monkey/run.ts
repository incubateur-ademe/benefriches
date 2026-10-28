/**
 * Monkey agent: `pnpm --filter e2e-tests monkey` registers a fresh user on the target
 * webapp, then lets Claude Code (Sonnet) explore it as that user through Playwright MCP and
 * write down the scenarios it tried. Everything lands in monkey-runs/<timestamp>/.
 * See monkey/README.md.
 */

import { spawn } from "node:child_process";
import { createWriteStream } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { createInterface } from "node:readline";

import { createTestUserData, createTestUserViaApi } from "../fixtures/auth.fixtures";
import { createMailInbox } from "../fixtures/mail-inbox/mail-inbox";
import {
  buildClaudeArgs,
  buildPlaywrightMcpConfig,
  readMonkeyConfig,
  type MonkeyConfig,
} from "./monkey-config";

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

type StopReason = "completed" | "turn-limit" | "time-limit" | "error";

type StreamEvent = {
  type?: string;
  subtype?: string;
  num_turns?: number;
  total_cost_usd?: number;
  message?: { content?: { type: string; text?: string; name?: string }[] };
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

function runClaude(options: {
  args: string[];
  cwd: string;
  timeoutMs: number;
  transcriptPath: string;
  stderrPath: string;
}): Promise<{ stopReason: StopReason; events: StreamEvent[] }> {
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

  const events: StreamEvent[] = [];
  createInterface({ input: child.stdout }).on("line", (line) => {
    transcript.write(`${line}\n`);
    try {
      const event = JSON.parse(line) as StreamEvent;
      events.push(event);
      if (event.type === "assistant") {
        for (const block of event.message?.content ?? []) {
          if (block.type === "tool_use") log(`tool call: ${block.name ?? "unknown"}`);
        }
      }
    } catch {
      // A non-JSON line is kept in the transcript only.
    }
  });

  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    log(`time limit of ${options.timeoutMs / 60_000} min reached: stopping the agent`);
    child.kill("SIGTERM");
  }, options.timeoutMs);

  return new Promise((resolvePromise, reject) => {
    child.on("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      transcript.end();
      const result = events.find((event) => event.type === "result");
      let stopReason: StopReason = "error";
      if (timedOut) stopReason = "time-limit";
      else if (result?.subtype === "error_max_turns") stopReason = "turn-limit";
      else if (code === 0 && result?.subtype === "success") stopReason = "completed";
      resolvePromise({ stopReason, events });
    });
  });
}

/** The scenarios the agent wrote down, in order: every text it wrote between tool calls. */
function buildNarrative(events: StreamEvent[], stopReason: StopReason): string {
  const texts = events
    .filter((event) => event.type === "assistant")
    .flatMap((event) => event.message?.content ?? [])
    .flatMap((block) => (block.type === "text" && block.text ? [block.text.trim()] : []));
  return `# Monkey run narrative\n\nStopped by: ${stopReason}\n\n${texts.join("\n\n")}\n`;
}

async function main() {
  const config = readMonkeyConfig();
  const runDir = join(RUNS_DIR, new Date().toISOString().replaceAll(":", "-"));
  const paths = {
    runDir,
    storageStatePath: join(runDir, "storage-state.json"),
    playwrightOutputDir: join(runDir, "playwright"),
  };
  await mkdir(paths.playwrightOutputDir, { recursive: true });
  log(`run folder: ${runDir}`);

  const email = await registerUser(config, paths.storageStatePath);
  log(`registered and logged in as ${email}`);

  const playwrightConfigPath = join(runDir, "playwright-mcp.config.json");
  await writeFile(
    playwrightConfigPath,
    JSON.stringify(buildPlaywrightMcpConfig(config.baseUrl, paths), null, 2),
  );
  const mcpConfigPath = join(runDir, "mcp.json");
  await writeFile(
    mcpConfigPath,
    JSON.stringify(
      {
        mcpServers: {
          playwright: { command: PLAYWRIGHT_MCP_BIN, args: ["--config", playwrightConfigPath] },
        },
      },
      null,
      2,
    ),
  );

  const promptTemplate = await readFile(join(__dirname, "prompt.md"), "utf8");
  const prompt = promptTemplate.replaceAll("{{BASE_URL}}", config.baseUrl);

  const startedAt = new Date();
  log(
    `starting the agent on ${config.baseUrl} (max ${config.maxTurns} turns, ${config.timeoutMs / 60_000} min)`,
  );
  const { stopReason, events } = await runClaude({
    args: buildClaudeArgs({ prompt, mcpConfigPath, maxTurns: config.maxTurns }),
    cwd: runDir,
    timeoutMs: config.timeoutMs,
    transcriptPath: join(runDir, "transcript.jsonl"),
    stderrPath: join(runDir, "claude-stderr.log"),
  });

  const result = events.find((event) => event.type === "result");
  await writeFile(join(runDir, "narrative.md"), buildNarrative(events, stopReason));
  await writeFile(
    join(runDir, "run.json"),
    JSON.stringify(
      {
        baseUrl: config.baseUrl,
        email,
        startedAt: startedAt.toISOString(),
        endedAt: new Date().toISOString(),
        stopReason,
        maxTurns: config.maxTurns,
        timeoutMs: config.timeoutMs,
        turns: result?.num_turns,
        costUsd: result?.total_cost_usd,
      },
      null,
      2,
    ),
  );
  log(`stopped by: ${stopReason}. Results in ${runDir}`);
  if (stopReason === "error") process.exitCode = 1;
}

main().catch((error: unknown) => {
  process.stderr.write(`[monkey] ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});

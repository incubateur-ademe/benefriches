/**
 * Settings of a monkey agent run, read from the environment, and the Playwright MCP and
 * Claude Code configurations built from them.
 */

const DEFAULT_MAX_TURNS = 60;
const DEFAULT_TIMEOUT_MINUTES = 20;

// The browser may only reach the target webapp, testmail.app and the address search API the
// site wizard depends on: anything else is blocked by the browser context
// (net::ERR_BLOCKED_BY_CLIENT).
const TESTMAIL_ORIGINS = ["https://testmail.app", "https://api.testmail.app"];
const ADDRESS_SEARCH_ORIGINS = ["https://data.geopf.fr"];

// Runs Playwright code in Node, outside the browser context: it would bypass the origin
// allowlist.
const DISALLOWED_MCP_TOOLS = ["mcp__playwright__browser_run_code_unsafe"];

export type MonkeyConfig = {
  baseUrl: string;
  testmail: { namespace: string; apiKey: string };
  maxTurns: number;
  timeoutMs: number;
  headed: boolean;
};

function readPositiveInteger(env: NodeJS.ProcessEnv, name: string, fallback: number): number {
  const raw = env[name];
  if (raw === undefined || raw === "") return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`Invalid ${name} "${raw}": expected a positive integer`);
  }
  return value;
}

export function readMonkeyConfig(env: NodeJS.ProcessEnv = process.env): MonkeyConfig {
  const missing = ["BASE_URL", "E2E_TESTMAIL_NAMESPACE", "E2E_TESTMAIL_API_KEY"].filter(
    (name) => !env[name],
  );
  if (missing.length > 0) {
    throw new Error(`The monkey agent needs ${missing.join(", ")}: see monkey/README.md`);
  }

  return {
    baseUrl: new URL(env.BASE_URL ?? "").origin,
    testmail: {
      namespace: env.E2E_TESTMAIL_NAMESPACE ?? "",
      apiKey: env.E2E_TESTMAIL_API_KEY ?? "",
    },
    maxTurns: readPositiveInteger(env, "MONKEY_MAX_TURNS", DEFAULT_MAX_TURNS),
    timeoutMs: readPositiveInteger(env, "MONKEY_TIMEOUT_MINUTES", DEFAULT_TIMEOUT_MINUTES) * 60_000,
    headed: env.MONKEY_HEADED === "true",
  };
}

export function allowedOrigins(baseUrl: string): string[] {
  return [new URL(baseUrl).origin, ...TESTMAIL_ORIGINS, ...ADDRESS_SEARCH_ORIGINS];
}

type RunPaths = {
  runDir: string;
  storageStatePath: string;
  playwrightOutputDir: string;
};

/** Playwright MCP configuration file (see @playwright/mcp config.d.ts). */
export function buildPlaywrightMcpConfig(baseUrl: string, paths: RunPaths, headed = false) {
  return {
    browser: {
      // No browserName: Playwright MCP drives the installed Google Chrome, as the ADW QA step does.
      isolated: true,
      launchOptions: { headless: !headed },
      contextOptions: {
        storageState: paths.storageStatePath,
        viewport: { width: 1440, height: 900 },
      },
    },
    network: { allowedOrigins: allowedOrigins(baseUrl) },
    outputDir: paths.playwrightOutputDir,
    // Raw log of every tool call and its result, in <outputDir>/session-*/session.md.
    saveSession: true,
    console: { level: "info" },
  };
}

export function buildClaudeArgs(options: {
  prompt: string;
  mcpConfigPath: string;
  maxTurns: number;
}): string[] {
  return [
    "--print",
    options.prompt,
    "--model",
    "sonnet",
    "--max-turns",
    String(options.maxTurns),
    "--output-format",
    "stream-json",
    "--verbose",
    "--no-session-persistence",
    // No built-in tool (no shell, no file access, no web fetch) and no other MCP server:
    // the agent can only drive the browser.
    "--restricted",
    "--tools",
    "",
    "--strict-mcp-config",
    "--mcp-config",
    options.mcpConfigPath,
    "--allowedTools",
    "mcp__playwright",
    "--disallowedTools",
    ...DISALLOWED_MCP_TOOLS,
  ];
}

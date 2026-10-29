import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildClaudeArgs, buildPlaywrightMcpConfig, readMonkeyConfig } from "./monkey-config";

const REQUIRED_ENV = {
  BASE_URL: "https://staging.example.org",
  E2E_TESTMAIL_NAMESPACE: "namespace",
  E2E_TESTMAIL_API_KEY: "api-key",
};

describe("readMonkeyConfig seed", () => {
  it("uses MONKEY_SEED when it is set", () => {
    const config = readMonkeyConfig({ ...REQUIRED_ENV, MONKEY_SEED: "1234" });

    assert.equal(config.seed, 1234);
  });

  for (const invalidSeed of ["-1", "1.5", "abc", "4294967296"]) {
    it(`rejects MONKEY_SEED "${invalidSeed}"`, () => {
      assert.throws(() => readMonkeyConfig({ ...REQUIRED_ENV, MONKEY_SEED: invalidSeed }), {
        message: `Invalid MONKEY_SEED "${invalidSeed}": expected an integer from 0 to 4294967295`,
      });
    });
  }
});

describe("readMonkeyConfig budgets", () => {
  it("defaults to 150 turns, 30 minutes, $5 and 5 hard errors", () => {
    const config = readMonkeyConfig(REQUIRED_ENV);

    assert.deepStrictEqual(config.budgets, {
      maxTurns: 150,
      timeoutMs: 30 * 60_000,
      maxCostUsd: 5,
      maxHardErrors: 5,
    });
  });

  it("reads each budget from the environment", () => {
    const config = readMonkeyConfig({
      ...REQUIRED_ENV,
      MONKEY_MAX_TURNS: "10",
      MONKEY_TIMEOUT_MINUTES: "2",
      MONKEY_MAX_COST_USD: "0.5",
      MONKEY_MAX_HARD_ERRORS: "1",
    });

    assert.deepStrictEqual(config.budgets, {
      maxTurns: 10,
      timeoutMs: 2 * 60_000,
      maxCostUsd: 0.5,
      maxHardErrors: 1,
    });
  });

  it("rejects a cost budget that isn't a positive number", () => {
    assert.throws(() => readMonkeyConfig({ ...REQUIRED_ENV, MONKEY_MAX_COST_USD: "0" }), {
      message: 'Invalid MONKEY_MAX_COST_USD "0": expected a positive number',
    });
  });
});

describe("buildClaudeArgs", () => {
  it("passes the turn and cost budgets to Claude Code", () => {
    const args = buildClaudeArgs({
      prompt: "prompt",
      mcpConfigPath: "mcp.json",
      budgets: { maxTurns: 150, maxCostUsd: 5 },
    });

    assert.deepStrictEqual(
      args.slice(args.indexOf("--max-turns"), args.indexOf("--max-turns") + 4),
      ["--max-turns", "150", "--max-budget-usd", "5"],
    );
  });
});

describe("buildPlaywrightMcpConfig", () => {
  it("loads the hard-error detector on every page", () => {
    const config = buildPlaywrightMcpConfig("https://staging.example.org", {
      runDir: "run",
      storageStatePath: "run/storage-state.json",
      playwrightOutputDir: "run/playwright",
      hardErrorDetectorPath: "/monkey/hard-error-detector.ts",
    });

    assert.deepStrictEqual(config.browser.initPage, ["/monkey/hard-error-detector.ts"]);
  });
});

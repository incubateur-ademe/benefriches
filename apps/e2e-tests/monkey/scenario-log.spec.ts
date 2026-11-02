import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";

import type { HardError, HardErrorRecord } from "./hard-error-detector";
import { drawRunPlan } from "./run-plan";
import {
  buildScenarioLog,
  buildScenarios,
  exitCodeOf,
  parseHardErrorRecords,
  parseSuspicion,
  resolveStopReason,
  writeFileAtomically,
  type AgentEvent,
  type ScenarioLog,
} from "./scenario-log";

const PLAN = drawRunPlan(42);
const BUDGETS = { maxTurns: 150, timeoutMs: 30 * 60_000, maxCostUsd: 5, maxHardErrors: 5 };

function at(second: number): string {
  return new Date(Date.UTC(2026, 9, 29, 10, 0, second)).toISOString();
}

function text(second: number, content: string): AgentEvent {
  return { kind: "text", timestamp: at(second), text: content };
}

function toolCall(second: number, tool: string, input: Record<string, unknown>): AgentEvent {
  return { kind: "tool-call", timestamp: at(second), tool: `mcp__playwright__${tool}`, input };
}

function hardError(second: number, overrides: Partial<HardError> = {}): HardErrorRecord {
  return {
    kind: "hard-error",
    hardError: {
      type: "server-error",
      severity: "major",
      message: "500 POST /api/sites/create-express",
      url: "https://staging.example.org/creer-site-foncier/demo",
      route: "/creer-site-foncier/demo",
      fingerprint: `fp-${second}`,
      timestamp: at(second),
      screenshot: `hard-error-${second}-server-error.png`,
      consoleExcerpt: ["[log] loaded"],
      networkExcerpt: ["POST https://staging.example.org/api/sites/create-express => 500"],
      ...overrides,
    },
  };
}

function scenarios(agentEvents: AgentEvent[], hardErrorRecords: HardErrorRecord[] = []) {
  return buildScenarios({
    runId: "run",
    plan: PLAN,
    agentEvents,
    hardErrorRecords,
    screenshotDir: "hard-errors",
  });
}

function log(overrides: Partial<Parameters<typeof buildScenarioLog>[0]> = {}): ScenarioLog {
  return buildScenarioLog({
    runId: "run",
    baseUrl: "https://staging.example.org",
    userEmail: "monkey@inbox.testmail.app",
    plan: PLAN,
    budgets: BUDGETS,
    startedAt: at(0),
    updatedAt: at(60),
    run: { status: "finished", stopReason: "completed", endedAt: at(60) },
    usage: { turns: 12, costUsd: 0.5 },
    agentEvents: [],
    hardErrorRecords: [],
    screenshotDir: "hard-errors",
    ...overrides,
  });
}

describe("parseSuspicion", () => {
  it("reads severity, confidence and evidence", () => {
    assert.deepStrictEqual(
      parseSuspicion("Suspicion: [major] [confidence 0.8] Surface lost after reload", at(1)),
      {
        kind: "suspicion",
        severity: "major",
        confidence: 0.8,
        evidence: "Surface lost after reload",
        timestamp: at(1),
      },
    );
  });

  it("accepts a bare confidence", () => {
    assert.equal(parseSuspicion("Suspicion: [minor] [0.3] Typo", at(1))?.confidence, 0.3);
  });

  it("ignores other lines", () => {
    assert.equal(parseSuspicion("Outcome: all good", at(1)), null);
  });
});

describe("buildScenarios", () => {
  it("splits the agent events at each scenario line", () => {
    const result = scenarios([
      toolCall(1, "browser_navigate", { url: "https://staging.example.org/mes-evaluations" }),
      text(2, "## Scenario: Create an express friche\nI start."),
      toolCall(3, "browser_type", { element: "Nom du site", ref: "e1", text: "Friche 1" }),
      text(4, "Outcome: created.\nDeviation: express instead of custom"),
      text(5, "## Scenario: Double submit"),
      toolCall(6, "browser_click", { element: "Valider", ref: "e2" }),
    ]);

    assert.deepStrictEqual(
      result.map(
        ({ id, seed, persona, goal, steps, inputs, outcome, agentOutcome, deviations }) => ({
          id,
          seed,
          persona,
          goal,
          steps,
          inputs,
          outcome,
          agentOutcome,
          deviations,
        }),
      ),
      [
        {
          id: "run-s1",
          seed: 42,
          persona: PLAN.persona,
          goal: "Create an express friche",
          steps: [
            {
              timestamp: at(1),
              tool: "browser_navigate",
              target: "https://staging.example.org/mes-evaluations",
            },
            { timestamp: at(3), tool: "browser_type", target: "Nom du site" },
          ],
          inputs: [{ timestamp: at(3), field: "Nom du site", value: "Friche 1" }],
          outcome: "ok",
          agentOutcome: "created.",
          deviations: ["express instead of custom"],
        },
        {
          id: "run-s2",
          seed: 42,
          persona: PLAN.persona,
          goal: "Double submit",
          steps: [{ timestamp: at(6), tool: "browser_click", target: "Valider" }],
          inputs: [],
          outcome: "ok",
          agentOutcome: null,
          deviations: [],
        },
      ],
    );
  });

  it("records the values filled in a form or selected", () => {
    const [scenario] = scenarios([
      text(1, "## Scenario: Fill"),
      toolCall(2, "browser_fill_form", {
        fields: [
          { name: "Superficie", ref: "e1", type: "textbox", value: "-5" },
          { name: "Friche", ref: "e2", type: "checkbox", value: true },
        ],
      }),
      toolCall(3, "browser_select_option", { element: "Commune", ref: "e3", values: ["Lyon"] }),
    ]);

    assert.deepStrictEqual(scenario?.inputs, [
      { timestamp: at(2), field: "Superficie", value: "-5" },
      { timestamp: at(2), field: "Friche", value: "true" },
      { timestamp: at(3), field: "Commune", value: "Lyon" },
    ]);
  });

  it("merges each hard error into the scenario running at its timestamp", () => {
    const result = scenarios(
      [text(10, "## Scenario: First"), text(20, "## Scenario: Second")],
      [hardError(5), hardError(15), hardError(25)],
    );

    assert.deepStrictEqual(
      result.map((scenario) => scenario.findings.map((finding) => finding.timestamp)),
      [[at(5), at(15)], [at(25)]],
    );
  });

  it("orders suspicions and hard errors of a scenario by timestamp", () => {
    const [scenario] = scenarios(
      [text(1, "## Scenario: One"), text(30, "Suspicion: [minor] [0.5] Label typo")],
      [hardError(20)],
    );

    assert.deepStrictEqual(
      scenario?.findings.map((finding) => finding.kind),
      ["hard_error", "suspicion"],
    );
  });

  it("gives a hard error its screenshot, excerpts, fingerprint and occurrences", () => {
    const [scenario] = scenarios(
      [text(1, "## Scenario: One")],
      [hardError(2), { kind: "repeat", fingerprint: "fp-2", timestamp: at(3) }],
    );

    assert.deepStrictEqual(scenario?.findings, [
      {
        kind: "hard_error",
        type: "server-error",
        severity: "major",
        evidence: "500 POST /api/sites/create-express",
        url: "https://staging.example.org/creer-site-foncier/demo",
        route: "/creer-site-foncier/demo",
        fingerprint: "fp-2",
        timestamp: at(2),
        occurrences: 2,
        screenshotPath: "hard-errors/hard-error-2-server-error.png",
        consoleExcerpt: ["[log] loaded"],
        networkExcerpt: ["POST https://staging.example.org/api/sites/create-express => 500"],
      },
    ]);
  });

  it("sets the outcome from the findings", () => {
    const result = scenarios(
      [
        text(1, "## Scenario: Clean"),
        text(10, "## Scenario: Suspicious\nSuspicion: [major] [0.7] Amount differs"),
        text(20, "## Scenario: Broken\nSuspicion: [minor] [0.2] Odd label"),
      ],
      [hardError(25)],
    );

    assert.deepStrictEqual(
      result.map((scenario) => scenario.outcome),
      ["ok", "suspicion", "hard_error"],
    );
  });

  it("puts everything in one unnamed scenario when the agent wrote no scenario line", () => {
    const result = scenarios(
      [toolCall(1, "browser_navigate", { url: "https://staging.example.org" })],
      [hardError(2)],
    );

    assert.deepStrictEqual(
      result.map(({ goal, outcome }) => ({ goal, outcome })),
      [{ goal: "Unnamed exploration", outcome: "hard_error" }],
    );
  });

  it("has no scenario before the agent did anything", () => {
    assert.deepStrictEqual(scenarios([]), []);
  });
});

describe("buildScenarioLog", () => {
  it("counts hard errors and suspicions", () => {
    const result = log({
      agentEvents: [text(1, "## Scenario: One\nSuspicion: [minor] [0.4] Typo")],
      hardErrorRecords: [
        hardError(2),
        hardError(3),
        { kind: "repeat", fingerprint: "fp-2", timestamp: at(4) },
      ],
    });

    assert.equal(result.hardErrorCount, 2);
    assert.equal(result.suspicionCount, 1);
  });
});

describe("exitCodeOf", () => {
  it("is 0 for a run with suspicions only", () => {
    const result = log({
      agentEvents: [text(1, "## Scenario: One\nSuspicion: [critical] [0.9] Data lost")],
    });

    assert.equal(exitCodeOf(result), 0);
  });

  it("is 1 for a run with a hard error", () => {
    const result = log({
      agentEvents: [text(1, "## Scenario: One")],
      hardErrorRecords: [hardError(2)],
    });

    assert.equal(exitCodeOf(result), 1);
  });

  it("is 1 for a run with a hard error, whatever stopped it", () => {
    const result = log({
      run: { status: "finished", stopReason: "error", endedAt: at(60) },
      hardErrorRecords: [hardError(2)],
    });

    assert.equal(exitCodeOf(result), 1);
  });

  it("is 2 when the agent failed without a hard error", () => {
    const result = log({ run: { status: "finished", stopReason: "error", endedAt: at(60) } });

    assert.equal(exitCodeOf(result), 2);
  });

  for (const stopReason of ["turn-limit", "time-limit", "cost-limit", "interrupted"] as const) {
    it(`is 0 for a run stopped by ${stopReason} without a hard error`, () => {
      const result = log({ run: { status: "finished", stopReason, endedAt: at(60) } });

      assert.equal(exitCodeOf(result), 0);
    });
  }
});

describe("parseHardErrorRecords", () => {
  it("skips the line being written", () => {
    const complete = JSON.stringify(hardError(1));
    const content = `${complete}\n${complete.slice(0, 20)}`;

    assert.deepStrictEqual(parseHardErrorRecords(content), [hardError(1)]);
  });
});

describe("writeFileAtomically", () => {
  it("replaces the file without leaving a temporary file", () => {
    const dir = mkdtempSync(join(tmpdir(), "monkey-log-"));
    const path = join(dir, "scenarios.json");

    writeFileAtomically(path, "first");
    writeFileAtomically(path, "second");

    assert.equal(readFileSync(path, "utf8"), "second");
    assert.deepStrictEqual(readdirSync(dir), ["scenarios.json"]);
  });
});

describe("resolveStopReason", () => {
  const cases = [
    { forcedStop: "time-limit", resultSubtype: undefined, exitCode: null, expected: "time-limit" },
    {
      forcedStop: "hard-error-limit",
      resultSubtype: undefined,
      exitCode: null,
      expected: "hard-error-limit",
    },
    {
      forcedStop: "interrupted",
      resultSubtype: undefined,
      exitCode: null,
      expected: "interrupted",
    },
    { forcedStop: null, resultSubtype: "error_max_turns", exitCode: 1, expected: "turn-limit" },
    {
      forcedStop: null,
      resultSubtype: "error_max_budget_usd",
      exitCode: 1,
      expected: "cost-limit",
    },
    { forcedStop: null, resultSubtype: "success", exitCode: 0, expected: "completed" },
    { forcedStop: null, resultSubtype: "error_during_execution", exitCode: 1, expected: "error" },
    { forcedStop: null, resultSubtype: undefined, exitCode: 1, expected: "error" },
  ] as const;
  for (const { expected, ...options } of cases) {
    it(`is ${expected} for ${JSON.stringify(options)}`, () => {
      assert.equal(resolveStopReason(options), expected);
    });
  }
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { drawRunPlan } from "./run-plan";
import { buildRunSummary } from "./run-summary";
import { buildScenarioLog, type AgentEvent, type ScenarioLog } from "./scenario-log";

const PLAN = drawRunPlan(42);

function at(second: number): string {
  return new Date(Date.UTC(2026, 9, 29, 10, 0, second)).toISOString();
}

function text(second: number, content: string): AgentEvent {
  return { kind: "text", timestamp: at(second), text: content };
}

function log(overrides: Partial<Parameters<typeof buildScenarioLog>[0]> = {}): ScenarioLog {
  return buildScenarioLog({
    runId: "2026-10-29T10-00-00.000Z",
    baseUrl: "https://staging.example.org",
    userEmail: "monkey@inbox.testmail.app",
    plan: PLAN,
    budgets: { maxTurns: 150, timeoutMs: 30 * 60_000, maxCostUsd: 5, maxHardErrors: 5 },
    startedAt: at(0),
    updatedAt: at(30),
    run: { status: "finished", stopReason: "completed", endedAt: at(30) },
    usage: { turns: 12, costUsd: 0.5 },
    agentEvents: [],
    hardErrorRecords: [],
    screenshotDir: "hard-errors",
    ...overrides,
  });
}

describe("buildRunSummary", () => {
  it("lists the scenarios with their outcome and findings", () => {
    const summary = buildRunSummary(
      log({
        agentEvents: [
          text(1, "## Scenario: Create an express friche"),
          text(10, "## Scenario: Reload | mid-wizard\nSuspicion: [major] [0.7] Surface lost"),
          text(20, "## Scenario: Submit twice"),
        ],
        hardErrorRecords: [
          {
            kind: "hard-error",
            hardError: {
              type: "server-error",
              severity: "major",
              message: "500 POST /api/sites/create-express",
              url: "https://staging.example.org/creer-site-foncier/demo",
              route: "/creer-site-foncier/demo",
              fingerprint: "abc123def456",
              timestamp: at(21),
              screenshot: "hard-error-1-server-error.png",
              consoleExcerpt: ["[log] loaded"],
              networkExcerpt: ["POST https://staging.example.org/api/sites/create-express => 500"],
            },
          },
          { kind: "repeat", fingerprint: "abc123def456", timestamp: at(22) },
        ],
      }),
    );

    assert.equal(
      summary,
      `## Monkey run 2026-10-29T10-00-00.000Z: 1 hard error

Target https://staging.example.org, seed \`42\` (replay with \`MONKEY_SEED=42\`), persona saboteur, AGRICULTURAL_OPERATION, PHOTOVOLTAIC_POWER_PLANT, custom.

| Run | Turns | Cost | Duration | Hard errors | Suspicions |
| --- | --- | --- | --- | --- | --- |
| stopped by completed | 12 / 150 | $0.50 / $5 | 0.5 min / 30 min | 1 / 5 | 1 |

### Scenarios

| # | Goal | Outcome | Findings |
| --- | --- | --- | --- |
| 1 | Create an express friche | ok | 0 |
| 2 | Reload \\| mid-wizard | suspicion | 1 |
| 3 | Submit twice | **hard error** | 1 |

### Findings

#### 2. Reload \\| mid-wizard

- Suspicion [major, confidence 0.7]: Surface lost

#### 3. Submit twice

- **Hard error** [major] server-error (×2): \`500 POST /api/sites/create-express\` on \`/creer-site-foncier/demo\`, screenshot \`hard-errors/hard-error-1-server-error.png\`, fingerprint \`abc123def456\`

  <details><summary>Console and network</summary>

  \`\`\`text
  [log] loaded
  ---
  POST https://staging.example.org/api/sites/create-express => 500
  \`\`\`

  </details>
`,
    );
  });

  it("says when a run has no scenario", () => {
    assert.match(buildRunSummary(log()), /### Scenarios\n\nNo scenario\.\n$/);
  });

  for (const stopReason of [
    "turn-limit",
    "time-limit",
    "cost-limit",
    "hard-error-limit",
  ] as const) {
    it(`says the run was stopped by ${stopReason}`, () => {
      const summary = buildRunSummary(
        log({ run: { status: "finished", stopReason, endedAt: at(30) } }),
      );

      assert.match(summary, new RegExp(`\\| stopped by ${stopReason} \\|`));
    });
  }

  it("says when a run is still running or was killed", () => {
    const summary = buildRunSummary(
      log({ run: { status: "running" }, usage: { turns: null, costUsd: null } }),
    );

    assert.match(summary, /\| still running \(or killed\) \| \? \/ 150 \| \? \/ \$5 \|/);
  });
});

/**
 * The scenario log of a monkey agent run (scenarios.json), rebuilt from scratch after every
 * agent event and every hard error, and written atomically: a killed run still leaves a
 * valid log. The schema is documented in monkey/README.md ("Scenario log").
 */

import { renameSync, writeFileSync } from "node:fs";

import type { HardError, HardErrorRecord, HardErrorType, Severity } from "./hard-error-detector";
import type { RunPlan } from "./run-plan";

export const SCENARIO_LOG_VERSION = 1;

export type StopReason =
  | "completed"
  | "turn-limit"
  | "time-limit"
  | "cost-limit"
  | "hard-error-limit"
  | "interrupted"
  | "error";

/** What the agent did, stamped when the runner received it. */
export type AgentEvent =
  | { kind: "text"; timestamp: string; text: string }
  | { kind: "tool-call"; timestamp: string; tool: string; input: Record<string, unknown> };

export type Step = { timestamp: string; tool: string; target: string | null };

export type Input = { timestamp: string; field: string; value: string };

export type HardErrorFinding = {
  kind: "hard_error";
  type: HardErrorType;
  severity: Severity;
  evidence: string;
  url: string;
  route: string;
  fingerprint: string;
  timestamp: string;
  occurrences: number;
  /** Relative to the run folder, null if the screenshot failed. */
  screenshotPath: string | null;
  consoleExcerpt: string[];
  networkExcerpt: string[];
};

export type SuspicionFinding = {
  kind: "suspicion";
  severity: Severity;
  /** From 0 to 1, as given by the agent. */
  confidence: number;
  evidence: string;
  timestamp: string;
};

export type Finding = HardErrorFinding | SuspicionFinding;

export type ScenarioOutcome = "ok" | "hard_error" | "suspicion";

export type Scenario = {
  id: string;
  seed: number;
  persona: RunPlan["persona"];
  goal: string;
  startedAt: string;
  steps: Step[];
  inputs: Input[];
  outcome: ScenarioOutcome;
  /** The agent's `Outcome:` line, null if it didn't write one. */
  agentOutcome: string | null;
  deviations: string[];
  findings: Finding[];
};

export type Budgets = {
  maxTurns: number;
  timeoutMs: number;
  maxCostUsd: number;
  maxHardErrors: number;
};

export type ScenarioLog = {
  version: typeof SCENARIO_LOG_VERSION;
  runId: string;
  baseUrl: string;
  /** The testmail.app address of the user the agent is logged in as. */
  userEmail: string | null;
  seed: number;
  plan: RunPlan;
  budgets: Budgets;
  startedAt: string;
  updatedAt: string;
  run: { status: "running" } | { status: "finished"; stopReason: StopReason; endedAt: string };
  usage: { turns: number | null; costUsd: number | null };
  hardErrorCount: number;
  suspicionCount: number;
  scenarios: Scenario[];
};

const SCENARIO_PATTERN = /^#{1,6}\s*Scenario:\s*(.+)$/i;
const OUTCOME_PATTERN = /^Outcome:\s*(.+)$/i;
const DEVIATION_PATTERN = /^Deviation:\s*(.+)$/i;
const SUSPICION_PATTERN =
  /^Suspicion:\s*\[(critical|major|minor)\]\s*\[(?:confidence\s*:?\s*)?(\d(?:\.\d+)?)\]\s*(.+)$/i;
const MCP_TOOL_PREFIX = "mcp__playwright__";

/** The agent's suspected bug on a `Suspicion: [severity] [confidence] evidence` line. */
export function parseSuspicion(line: string, timestamp: string): SuspicionFinding | null {
  const match = SUSPICION_PATTERN.exec(line.trim());
  if (!match) return null;
  const [, severity = "", confidence = "", evidence = ""] = match;
  return {
    kind: "suspicion",
    severity: severity.toLowerCase() as Severity,
    confidence: Math.min(1, Number(confidence)),
    evidence: evidence.trim(),
    timestamp,
  };
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value !== "" ? value : null;
}

function toStep(event: Extract<AgentEvent, { kind: "tool-call" }>): Step {
  const { input } = event;
  return {
    timestamp: event.timestamp,
    tool: event.tool.replace(MCP_TOOL_PREFIX, ""),
    target: asString(input.element) ?? asString(input.url) ?? asString(input.key),
  };
}

/** The values the agent typed, filled in or selected. */
function toInputs(event: Extract<AgentEvent, { kind: "tool-call" }>): Input[] {
  const { input, timestamp } = event;
  const tool = event.tool.replace(MCP_TOOL_PREFIX, "");
  const field = asString(input.element) ?? asString(input.ref) ?? "unknown field";
  if (tool === "browser_type") {
    return [{ timestamp, field, value: typeof input.text === "string" ? input.text : "" }];
  }
  if (tool === "browser_select_option" && Array.isArray(input.values)) {
    return [{ timestamp, field, value: input.values.map(String).join(", ") }];
  }
  if (tool === "browser_fill_form" && Array.isArray(input.fields)) {
    return (input.fields as Record<string, unknown>[]).map((formField) => ({
      timestamp,
      field: asString(formField.name) ?? asString(formField.ref) ?? "unknown field",
      value:
        typeof formField.value === "string"
          ? formField.value
          : JSON.stringify(formField.value ?? ""),
    }));
  }
  return [];
}

function toFinding(hardError: HardError, screenshotDir: string): HardErrorFinding {
  return {
    kind: "hard_error",
    type: hardError.type,
    severity: hardError.severity,
    evidence: hardError.message,
    url: hardError.url,
    route: hardError.route,
    fingerprint: hardError.fingerprint,
    timestamp: hardError.timestamp,
    occurrences: 1,
    screenshotPath: hardError.screenshot ? `${screenshotDir}/${hardError.screenshot}` : null,
    consoleExcerpt: hardError.consoleExcerpt,
    networkExcerpt: hardError.networkExcerpt,
  };
}

function outcomeOf(findings: Finding[]): ScenarioOutcome {
  if (findings.some((finding) => finding.kind === "hard_error")) return "hard_error";
  if (findings.length > 0) return "suspicion";
  return "ok";
}

type DraftScenario = Omit<Scenario, "id" | "outcome">;

/**
 * Splits the agent events into scenarios at each `## Scenario:` line, then merges the hard
 * errors by timestamp: a hard error belongs to the scenario running when it happened. What
 * happens before the first scenario belongs to it; a run without a scenario line has one
 * "Unnamed exploration" scenario.
 */
export function buildScenarios(input: {
  runId: string;
  plan: RunPlan;
  agentEvents: AgentEvent[];
  hardErrorRecords: HardErrorRecord[];
  screenshotDir: string;
}): Scenario[] {
  const { runId, plan, agentEvents, hardErrorRecords, screenshotDir } = input;
  const newDraft = (goal: string, startedAt: string): DraftScenario => ({
    seed: plan.seed,
    persona: plan.persona,
    goal,
    startedAt,
    steps: [],
    inputs: [],
    agentOutcome: null,
    deviations: [],
    findings: [],
  });
  const drafts: DraftScenario[] = [];
  const pending = newDraft(
    "Unnamed exploration",
    agentEvents[0]?.timestamp ?? new Date(0).toISOString(),
  );
  const current = () => drafts.at(-1) ?? pending;

  for (const event of agentEvents) {
    if (event.kind === "tool-call") {
      current().steps.push(toStep(event));
      current().inputs.push(...toInputs(event));
      continue;
    }
    for (const line of event.text.split("\n").map((text) => text.trim())) {
      const scenarioMatch = SCENARIO_PATTERN.exec(line);
      if (scenarioMatch) {
        const goal = (scenarioMatch[1] ?? "").trim();
        // What happened before the first scenario line belongs to it.
        drafts.push(drafts.length === 0 ? { ...pending, goal } : newDraft(goal, event.timestamp));
        continue;
      }
      const suspicion = parseSuspicion(line, event.timestamp);
      if (suspicion) current().findings.push(suspicion);
      const outcome = OUTCOME_PATTERN.exec(line)?.[1];
      if (outcome) current().agentOutcome = outcome.trim();
      const deviation = DEVIATION_PATTERN.exec(line)?.[1];
      if (deviation) current().deviations.push(deviation.trim());
    }
  }

  const hasActivity = pending.steps.length > 0 || pending.findings.length > 0;
  if (drafts.length === 0 && (hasActivity || hardErrorRecords.length > 0)) drafts.push(pending);

  const findingsByFingerprint = new Map<string, HardErrorFinding>();
  for (const record of hardErrorRecords) {
    if (record.kind === "repeat") {
      const finding = findingsByFingerprint.get(record.fingerprint);
      if (finding) finding.occurrences += 1;
      continue;
    }
    const finding = toFinding(record.hardError, screenshotDir);
    findingsByFingerprint.set(finding.fingerprint, finding);
    const running = drafts.filter((draft) => draft.startedAt <= finding.timestamp);
    (running.at(-1) ?? drafts[0] ?? pending).findings.push(finding);
  }

  return drafts.map((draft, index) => ({
    id: `${runId}-s${index + 1}`,
    seed: draft.seed,
    persona: draft.persona,
    goal: draft.goal,
    startedAt: draft.startedAt,
    steps: draft.steps,
    inputs: draft.inputs,
    outcome: outcomeOf(draft.findings),
    agentOutcome: draft.agentOutcome,
    deviations: draft.deviations,
    findings: draft.findings.toSorted((a, b) => a.timestamp.localeCompare(b.timestamp)),
  }));
}

export function buildScenarioLog(input: {
  runId: string;
  baseUrl: string;
  userEmail: string | null;
  plan: RunPlan;
  budgets: Budgets;
  startedAt: string;
  updatedAt: string;
  run: ScenarioLog["run"];
  usage: ScenarioLog["usage"];
  agentEvents: AgentEvent[];
  hardErrorRecords: HardErrorRecord[];
  screenshotDir: string;
}): ScenarioLog {
  const scenarios = buildScenarios(input);
  const findings = scenarios.flatMap((scenario) => scenario.findings);
  return {
    version: SCENARIO_LOG_VERSION,
    runId: input.runId,
    baseUrl: input.baseUrl,
    userEmail: input.userEmail,
    seed: input.plan.seed,
    plan: input.plan,
    budgets: input.budgets,
    startedAt: input.startedAt,
    updatedAt: input.updatedAt,
    run: input.run,
    usage: input.usage,
    hardErrorCount: findings.filter((finding) => finding.kind === "hard_error").length,
    suspicionCount: findings.filter((finding) => finding.kind === "suspicion").length,
    scenarios,
  };
}

/**
 * Why the run stopped: the budget the runner enforced (time, hard errors) or the user's
 * interruption first, else what Claude Code reported (turns, cost, success or failure).
 */
export function resolveStopReason(options: {
  forcedStop: StopReason | null;
  resultSubtype: string | undefined;
  exitCode: number | null;
}): StopReason {
  const { forcedStop, resultSubtype, exitCode } = options;
  if (forcedStop) return forcedStop;
  if (resultSubtype === "error_max_turns") return "turn-limit";
  if (resultSubtype === "error_max_budget_usd") return "cost-limit";
  if (exitCode === 0 && resultSubtype === "success") return "completed";
  return "error";
}

/** Distinct hard errors in hard-errors.jsonl: repeats of a known one don't count. */
export function countHardErrors(records: HardErrorRecord[]): number {
  return records.filter((record) => record.kind === "hard-error").length;
}

/** The complete lines of hard-errors.jsonl: a line being written is skipped until complete. */
export function parseHardErrorRecords(content: string): HardErrorRecord[] {
  const lines = content.split("\n");
  lines.pop();
  return lines
    .filter((line) => line.trim() !== "")
    .map((line) => JSON.parse(line) as HardErrorRecord);
}

/**
 * 1 when the run found a hard error: suspicions alone never fail it. 2 when the agent itself
 * failed, so that a run that explored nothing isn't green.
 */
export function exitCodeOf(log: ScenarioLog): number {
  if (log.hardErrorCount > 0) return 1;
  if (log.run.status === "finished" && log.run.stopReason === "error") return 2;
  return 0;
}

/** Writes a file in one step: a reader, or a run killed mid-write, never sees half of it. */
export function writeFileAtomically(path: string, content: string) {
  const temporaryPath = `${path}.tmp`;
  writeFileSync(temporaryPath, content);
  renameSync(temporaryPath, path);
}

/**
 * The Markdown summary of a monkey agent run (summary.md), also appended to the GitHub job
 * summary when GITHUB_STEP_SUMMARY is set: the scenarios with their outcome and findings.
 */

import type { Finding, ScenarioLog, ScenarioOutcome } from "./scenario-log";

const OUTCOME_LABELS: Record<ScenarioOutcome, string> = {
  ok: "ok",
  hard_error: "**hard error**",
  suspicion: "suspicion",
};

/** Text safe in a Markdown table cell: one line, no column separator. */
function cell(text: string): string {
  return text.replace(/\s+/g, " ").replaceAll("|", "\\|").trim();
}

function inlineCode(text: string): string {
  return `\`${text.replace(/\s+/g, " ").replaceAll("`", "'")}\``;
}

function formatDuration(startedAt: string, endedAt: string): string {
  const minutes = (Date.parse(endedAt) - Date.parse(startedAt)) / 60_000;
  return `${minutes.toFixed(1)} min`;
}

function formatStatus(log: ScenarioLog): string {
  if (log.run.status === "running") return "still running (or killed)";
  return `stopped by ${log.run.stopReason}`;
}

function formatFinding(finding: Finding): string[] {
  if (finding.kind === "suspicion") {
    return [
      `- Suspicion [${finding.severity}, confidence ${finding.confidence}]: ${cell(finding.evidence)}`,
    ];
  }
  const occurrences = finding.occurrences > 1 ? ` (×${finding.occurrences})` : "";
  const screenshot = finding.screenshotPath
    ? `screenshot ${inlineCode(finding.screenshotPath)}`
    : "no screenshot";
  const lines = [
    `- **Hard error** [${finding.severity}] ${finding.type}${occurrences}: ${inlineCode(finding.evidence)} on ${inlineCode(finding.route)}, ${screenshot}, fingerprint ${inlineCode(finding.fingerprint)}`,
  ];
  if (finding.consoleExcerpt.length > 0 || finding.networkExcerpt.length > 0) {
    lines.push(
      "",
      "  <details><summary>Console and network</summary>",
      "",
      "  ```text",
      ...finding.consoleExcerpt.map((line) => `  ${line}`),
      ...(finding.consoleExcerpt.length > 0 && finding.networkExcerpt.length > 0 ? ["  ---"] : []),
      ...finding.networkExcerpt.map((line) => `  ${line}`),
      "  ```",
      "",
      "  </details>",
      "",
    );
  }
  return lines;
}

export function buildRunSummary(log: ScenarioLog): string {
  const verdict =
    log.hardErrorCount > 0
      ? `${log.hardErrorCount} hard error${log.hardErrorCount > 1 ? "s" : ""}`
      : "no hard error";
  const endedAt = log.run.status === "finished" ? log.run.endedAt : log.updatedAt;
  const lines = [
    `## Monkey run ${log.runId}: ${verdict}`,
    "",
    `Target ${log.baseUrl}, seed \`${log.seed}\` (replay with \`MONKEY_SEED=${log.seed}\`), persona ${log.plan.persona}, ${log.plan.siteNature}, ${log.plan.projectType}, ${log.plan.creationMode}.`,
    "",
    "| Run | Turns | Cost | Duration | Hard errors | Suspicions |",
    "| --- | --- | --- | --- | --- | --- |",
    `| ${formatStatus(log)} | ${log.usage.turns ?? "?"} / ${log.budgets.maxTurns} | ${log.usage.costUsd === null ? "?" : `$${log.usage.costUsd.toFixed(2)}`} / $${log.budgets.maxCostUsd} | ${formatDuration(log.startedAt, endedAt)} / ${log.budgets.timeoutMs / 60_000} min | ${log.hardErrorCount} / ${log.budgets.maxHardErrors} | ${log.suspicionCount} |`,
    "",
    "### Scenarios",
    "",
  ];

  if (log.scenarios.length === 0) {
    lines.push("No scenario.");
    return `${lines.join("\n")}\n`;
  }

  lines.push("| # | Goal | Outcome | Findings |", "| --- | --- | --- | --- |");
  log.scenarios.forEach((scenario, index) => {
    lines.push(
      `| ${index + 1} | ${cell(scenario.goal)} | ${OUTCOME_LABELS[scenario.outcome]} | ${scenario.findings.length} |`,
    );
  });

  const withFindings = log.scenarios.filter((scenario) => scenario.findings.length > 0);
  if (withFindings.length > 0) lines.push("", "### Findings");
  for (const scenario of withFindings) {
    const index = log.scenarios.indexOf(scenario) + 1;
    lines.push("", `#### ${index}. ${cell(scenario.goal)}`, "");
    lines.push(...scenario.findings.flatMap(formatFinding));
  }
  return `${lines
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trimEnd()}\n`;
}

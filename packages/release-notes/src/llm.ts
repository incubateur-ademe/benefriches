import { readFileSync } from "node:fs";

import type { Commit } from "./commits.ts";

const MODEL = "claude-sonnet-5-5";
const API_URL = "https://api.anthropic.com/v1/messages";
const API_VERSION = "2023-06-01";
const MAX_OUTPUT_TOKENS = 16000;
const TOOL_NAME = "write_release_note";
const SHORT_ID_LENGTH = 8;

export const AREAS = ["Web", "API", "Tests", "Infra"] as const;
export type Area = (typeof AREAS)[number];

export type Feature = { title: string; description: string };
export type OtherChange = {
  area: Area;
  userVisibleFix: boolean;
  summary: string;
  commitIds: string[];
};
export type ReleaseSummary = {
  features: Feature[];
  otherChanges: OtherChange[];
  unclassifiedCommitIds: string[];
};

const TOOL = {
  name: TOOL_NAME,
  description: "Return the release note of the version, in French.",
  strict: true,
  input_schema: {
    type: "object",
    additionalProperties: false,
    required: ["features", "otherChanges"],
    properties: {
      features: {
        type: "array",
        description: "User-visible features. Commits about the same functional change are merged.",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["title", "description", "commitIds"],
          properties: {
            title: { type: "string", description: "Short feature title, in French." },
            description: {
              type: "string",
              description: "One or two sentences in plain French, no jargon.",
            },
            commitIds: { type: "array", items: { type: "string" } },
          },
        },
      },
      otherChanges: {
        type: "array",
        description: "Every commit that is not part of a feature, grouped into items.",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["area", "userVisibleFix", "summary", "commitIds"],
          properties: {
            area: { type: "string", enum: AREAS },
            userVisibleFix: {
              type: "boolean",
              description: "true for a bug fix that users of the app can see, false otherwise.",
            },
            summary: { type: "string", description: "One-sentence summary, in French." },
            commitIds: { type: "array", items: { type: "string" } },
          },
        },
      },
    },
  },
};

const buildSystemPrompt = (
  glossary: string,
): string => `You write the release note of Bénéfriches, a web app that helps land-development project managers assess the impacts of reconverting a site (friche).

The readers are non-technical French-speaking team members (product, support, partners) and developers. WRITE EVERYTHING IN FRENCH. For Bénéfriches terms, use the French "UI wording (FR)" given in the glossary below, consistently. Do not translate code identifiers literally when the glossary gives the UI wording.

You receive the commits of one release (identifier, conventional-commit subject, body). Call the tool ${TOOL_NAME} exactly once, and reply with nothing else.

Rules:
- "features": every change visible in the app, for any kind of user, administrators included (Administration pages, user timeline, header links…), that adds, changes or removes a capability. This includes the removal of a screen, tab, view or element users could see. Typically "feat" commits that touch what the app displays. Merge commits about the same functional change into ONE item. Write in plain French, no jargon, no commit identifiers, no technical terms (API, endpoint, refactor, SQL…). Do not invent anything the commits do not say.
- "otherChanges": every other commit (fixes, refactors, chores, tests, docs, CI, dependency and security updates, purely technical feat). Group commits about the same change into one item with a one-sentence French summary. Keep separate items for separate changes: never lump unrelated commits together, and never put a user-visible fix in the same item as internal work. Each item has one area: Web (apps/web), API (apps/api, packages/shared), Tests (any commit that only adds or fixes unit, integration or e2e tests, even in apps/web), Infra (CI, deployment, tooling, dependencies, docs). Set userVisibleFix to true only for a bug fix that users of the app could see; false for everything internal.
- Data fallbacks, default values when an external service fails, robustness and performance work are internal changes (userVisibleFix false), even when they fix an error.
- Check your French spelling carefully (e.g. "friche", not "fritche").
- Every commit identifier must appear in the commitIds of exactly one item (feature or other change), never in two. Use the identifiers exactly as given.
- Skip nothing, and never put a feature visible in the app in otherChanges.

Glossary (English, with the French UI wording of each term):

${glossary}`;

const buildUserPrompt = (commits: Commit[]): string =>
  commits
    .map(
      (commit) =>
        `<commit id="${commit.id.slice(0, SHORT_ID_LENGTH)}">\n${commit.subject}${commit.body === "" ? "" : `\n\n${commit.body}`}\n</commit>`,
    )
    .join("\n\n");

export const readGlossary = (): string =>
  readFileSync(new URL("../../../CONTEXT.md", import.meta.url), "utf8");

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim() !== "";

const parseCommitIds = (value: unknown, knownIds: Map<string, string>): string[] => {
  if (!Array.isArray(value) || value.length === 0)
    throw new Error("commitIds must be a non-empty array");
  return value.map((id) => {
    const fullId = typeof id === "string" ? knownIds.get(id) : undefined;
    if (fullId === undefined) throw new Error(`unknown commit id ${JSON.stringify(id)}`);
    return fullId;
  });
};

const parseFeature = (
  value: unknown,
  knownIds: Map<string, string>,
): Feature & { commitIds: string[] } => {
  if (
    !isRecord(value) ||
    !isNonEmptyString(value["title"]) ||
    !isNonEmptyString(value["description"])
  )
    throw new Error("invalid feature");
  return {
    title: value["title"].trim(),
    description: value["description"].trim(),
    commitIds: parseCommitIds(value["commitIds"], knownIds),
  };
};

const parseArea = (value: unknown): Area => {
  const area = AREAS.find((candidate) => candidate === value);
  if (area === undefined) throw new Error(`invalid area ${JSON.stringify(value)}`);
  return area;
};

const parseOtherChange = (value: unknown, knownIds: Map<string, string>): OtherChange => {
  if (
    !isRecord(value) ||
    typeof value["userVisibleFix"] !== "boolean" ||
    !isNonEmptyString(value["summary"])
  )
    throw new Error("invalid other change");
  return {
    area: parseArea(value["area"]),
    userVisibleFix: value["userVisibleFix"],
    summary: value["summary"].trim(),
    commitIds: parseCommitIds(value["commitIds"], knownIds),
  };
};

export const parseReleaseSummary = (input: unknown, commits: Commit[]): ReleaseSummary => {
  const knownIds = new Map(
    commits.map((commit) => [commit.id.slice(0, SHORT_ID_LENGTH), commit.id]),
  );
  if (
    !isRecord(input) ||
    !Array.isArray(input["features"]) ||
    !Array.isArray(input["otherChanges"])
  )
    throw new Error("response does not match the expected structure");

  const features = input["features"].map((feature) => parseFeature(feature, knownIds));
  const otherChanges = input["otherChanges"].map((change) => parseOtherChange(change, knownIds));

  const seen = new Set<string>();
  const withoutDuplicates = <T extends { commitIds: string[] }>(items: T[]): T[] =>
    items.flatMap((item) => {
      const commitIds = item.commitIds.filter((id) => !seen.has(id));
      commitIds.forEach((id) => seen.add(id));
      return commitIds.length > 0 ? [{ ...item, commitIds }] : [];
    });

  const uniqueFeatures = withoutDuplicates(features);
  const uniqueChanges = withoutDuplicates(otherChanges);

  return {
    features: uniqueFeatures.map(({ title, description }) => ({ title, description })),
    otherChanges: uniqueChanges,
    unclassifiedCommitIds: commits.map((commit) => commit.id).filter((id) => !seen.has(id)),
  };
};

export const summariseCommits = async (
  commits: Commit[],
  glossary: string,
  apiKey: string,
): Promise<ReleaseSummary> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": API_VERSION,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: MAX_OUTPUT_TOKENS,
      system: buildSystemPrompt(glossary),
      tools: [TOOL],
      tool_choice: { type: "auto" },
      messages: [{ role: "user", content: buildUserPrompt(commits) }],
    }),
  });

  const body: unknown = await response.json().catch(() => undefined);
  if (!response.ok) {
    const message =
      isRecord(body) && isRecord(body["error"]) && typeof body["error"]["message"] === "string"
        ? body["error"]["message"]
        : "no details";
    throw new Error(`Anthropic API answered ${response.status}: ${message}`);
  }
  if (!isRecord(body) || !Array.isArray(body["content"]))
    throw new Error("unexpected API response");
  const usage = body["usage"];
  if (isRecord(usage)) {
    process.stderr.write(
      `usage: model=${MODEL} input_tokens=${String(usage["input_tokens"])} output_tokens=${String(usage["output_tokens"])}\n`,
    );
  }
  if (body["stop_reason"] === "max_tokens") throw new Error("model output was truncated");

  const toolUse = body["content"].find(
    (block): block is Record<string, unknown> =>
      isRecord(block) && block["type"] === "tool_use" && block["name"] === TOOL_NAME,
  );
  if (toolUse === undefined) throw new Error("model did not call the tool");

  return parseReleaseSummary(toolUse["input"], commits);
};

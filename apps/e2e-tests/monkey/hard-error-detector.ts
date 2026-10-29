/**
 * Deterministic hard-error detection of a monkey agent run, independent of the LLM.
 *
 * Playwright MCP loads this file as an `initPage` script (see buildPlaywrightMcpConfig): it
 * calls the default export with every page it opens, in the MCP server process. The detector
 * listens to the page's exceptions, console and responses, scans its text every
 * SCAN_INTERVAL_MS, takes a screenshot of each new hard error and appends it to
 * <outputDir>/hard-errors.jsonl, one JSON record per line, so a killed run keeps every record
 * written so far. The runner (run.ts) reads that file to merge hard errors into the scenario
 * log and to stop the run after MONKEY_MAX_HARD_ERRORS.
 *
 * Playwright MCP `require()`s this file with Node's type stripping, outside tsx: keep it
 * self-contained (no relative import, `import type` only for types) and erasable-syntax only.
 */

import { createHash } from "node:crypto";
import { appendFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

import type { ConsoleMessage, Page, Request, Response } from "@playwright/test";

export type Severity = "critical" | "major" | "minor";

export type HardErrorType =
  | "js-exception"
  | "console-error"
  | "server-error"
  | "client-error"
  | "blank-page"
  | "broken-text"
  | "admin-access";

export const HARD_ERROR_SEVERITIES: Record<HardErrorType, Severity> = {
  "admin-access": "critical",
  "blank-page": "critical",
  "server-error": "major",
  "client-error": "major",
  "js-exception": "major",
  "broken-text": "major",
  "console-error": "minor",
};

export type HardError = {
  type: HardErrorType;
  severity: Severity;
  /** What happened, e.g. `500 POST /api/sites/create-express`. */
  message: string;
  /** URL of the page when it happened. */
  url: string;
  /** `url` without origin, ids replaced by `:id`: identifies the page across runs. */
  route: string;
  /** Hash of type, message and route: the same error on the same page has the same one. */
  fingerprint: string;
  timestamp: string;
  /** File name of the screenshot in the detector output directory, null if it failed. */
  screenshot: string | null;
  /** The last console messages of the page, oldest first. */
  consoleExcerpt: string[];
  /** The last requests of the page with their status, oldest first. */
  networkExcerpt: string[];
};

/** A line of hard-errors.jsonl: a new hard error, or a new occurrence of a known one. */
export type HardErrorRecord =
  | { kind: "hard-error"; hardError: HardError }
  | { kind: "repeat"; fingerprint: string; timestamp: string };

export type HardErrorCandidate = { type: HardErrorType; message: string };

export const HARD_ERRORS_FILE_NAME = "hard-errors.jsonl";
const SCAN_INTERVAL_MS = 1_500;
const EXCERPT_LENGTH = 15;
// Consecutive scans that must find a candidate before it is a hard error: a page is briefly
// blank while it loads. A candidate found by every scan is reported once, when it appears.
const CONFIRMATION_SCANS: Partial<Record<HardErrorType, number>> = {
  "blank-page": 3,
  "admin-access": 2,
};
// Shown to a regular user who opens /admin: the access control works.
const ADMIN_ACCESS_DENIED_TEXT = "Accès réservé aux administrateurs";

const UUID_PATTERN = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;
const BROKEN_TEXT_PATTERN = /(?<![\p{L}\p{N}_])(NaN|undefined)(?![\p{L}\p{N}_])/u;

function normalizeIds(text: string): string {
  return text.replace(UUID_PATTERN, ":id").replace(/\b\d{2,}\b/g, ":n");
}

/** Path and query of a URL, ids replaced, so that the same page has the same route. */
export function normalizeRoute(url: string): string {
  const { pathname, search } = new URL(url);
  return normalizeIds(`${pathname}${search}`);
}

export function computeFingerprint(type: HardErrorType, message: string, route: string): string {
  return createHash("sha256")
    .update(`${type}\n${normalizeIds(message)}\n${route}`)
    .digest("hex")
    .slice(0, 12);
}

function isOnOrigin(url: string, origin: string): boolean {
  try {
    return new URL(url).origin === origin;
  } catch {
    return false;
  }
}

/**
 * A 4xx is expected when it is the app's answer to the user rather than a bug:
 * - 401 or 403 from the admin API: the user is not an admin.
 * - 429: the API rate limit.
 * - 404 on a GET of a resource whose id is in the page URL: the page names a site or project
 *   that doesn't exist, e.g. a URL edited by hand.
 */
function isExpectedClientError(options: {
  method: string;
  status: number;
  path: string;
  pageUrl: string;
}): boolean {
  const { method, status, path, pageUrl } = options;
  if (status === 429) return true;
  if (path.startsWith("/api/admin") && (status === 401 || status === 403)) return true;
  if (status === 404 && method === "GET") {
    const ids = path.match(UUID_PATTERN) ?? [];
    return ids.some((id) => pageUrl.toLowerCase().includes(id.toLowerCase()));
  }
  return false;
}

/** The hard error a response of the target origin is, if any. */
export function classifyResponse(options: {
  method: string;
  url: string;
  status: number;
  pageUrl: string;
  targetOrigin: string;
}): HardErrorCandidate | null {
  const { method, url, status, pageUrl, targetOrigin } = options;
  if (!isOnOrigin(url, targetOrigin)) return null;
  const path = new URL(url).pathname;
  const message = `${status} ${method} ${path}`;

  if (path.startsWith("/api/admin") && status >= 200 && status < 300) {
    return { type: "admin-access", message: `Admin API response: ${message}` };
  }
  if (status >= 500) return { type: "server-error", message };
  if (status >= 400 && !isExpectedClientError({ method, status, path, pageUrl })) {
    return { type: "client-error", message };
  }
  return null;
}

/**
 * The hard error a console message is, if any. Chrome logs every failed request as
 * "Failed to load resource": responses are classified on their own, and requests blocked by
 * the origin allowlist (net::ERR_BLOCKED_BY_CLIENT) are expected.
 */
export function classifyConsoleMessage(type: string, text: string): HardErrorCandidate | null {
  if (type !== "error") return null;
  if (text.startsWith("Failed to load resource") || text.includes("net::ERR_BLOCKED_BY_CLIENT")) {
    return null;
  }
  return { type: "console-error", message: text };
}

/** "NaN" or "undefined" shown as a word in the page text, with some context. */
export function findBrokenText(text: string): HardErrorCandidate | null {
  const match = BROKEN_TEXT_PATTERN.exec(text);
  if (!match) return null;
  const start = Math.max(0, match.index - 40);
  const end = Math.min(text.length, match.index + match[0].length + 40);
  const context = text.slice(start, end).replace(/\s+/g, " ").trim();
  return { type: "broken-text", message: `"${match[0]}" shown on the page: …${context}…` };
}

export function isAdminPage(url: string): boolean {
  const { pathname } = new URL(url);
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

/** What a scan of a page of the target origin finds, before any confirmation over scans. */
export function inspectPageText(url: string, text: string): HardErrorCandidate[] {
  const trimmed = text.trim();
  if (trimmed === "") return [{ type: "blank-page", message: "Blank page: no text on the page" }];

  const candidates: HardErrorCandidate[] = [];
  if (isAdminPage(url) && !trimmed.includes(ADMIN_ACCESS_DENIED_TEXT)) {
    candidates.push({ type: "admin-access", message: "Admin page shown to a regular user" });
  }
  const brokenText = findBrokenText(trimmed);
  if (brokenText) candidates.push(brokenText);
  return candidates;
}

function pushBounded(buffer: string[], line: string) {
  buffer.push(line);
  if (buffer.length > EXCERPT_LENGTH) buffer.shift();
}

type DetectorOptions = {
  targetOrigin: string;
  outputDir: string;
  scanIntervalMs?: number;
};

/** The initPage function of Playwright MCP, for one run: it shares known hard errors across pages. */
export function createHardErrorDetector(options: DetectorOptions) {
  const { targetOrigin, outputDir } = options;
  const scanIntervalMs = options.scanIntervalMs ?? SCAN_INTERVAL_MS;
  const logPath = join(outputDir, HARD_ERRORS_FILE_NAME);
  const knownFingerprints = new Set<string>();
  let screenshotCount = 0;
  mkdirSync(outputDir, { recursive: true });

  function append(record: HardErrorRecord) {
    appendFileSync(logPath, `${JSON.stringify(record)}\n`);
  }

  return function attachToPage({ page }: { page: Page }): Promise<void> {
    const consoleBuffer: string[] = [];
    const networkBuffer: string[] = [];
    // How many scans in a row found each candidate, by type, message and page URL.
    let streaks = new Map<string, number>();

    async function report(candidate: HardErrorCandidate) {
      const url = page.url();
      if (!isOnOrigin(url, targetOrigin)) return;
      const route = normalizeRoute(url);
      const fingerprint = computeFingerprint(candidate.type, candidate.message, route);
      const timestamp = new Date().toISOString();
      if (knownFingerprints.has(fingerprint)) {
        append({ kind: "repeat", fingerprint, timestamp });
        return;
      }
      knownFingerprints.add(fingerprint);
      const consoleExcerpt = [...consoleBuffer];
      const networkExcerpt = [...networkBuffer];

      screenshotCount += 1;
      const screenshotName = `hard-error-${screenshotCount}-${candidate.type}.png`;
      const screenshot = await page
        .screenshot({ path: join(outputDir, screenshotName) })
        .then(() => screenshotName)
        .catch(() => null);

      append({
        kind: "hard-error",
        hardError: {
          type: candidate.type,
          severity: HARD_ERROR_SEVERITIES[candidate.type],
          message: candidate.message,
          url,
          route,
          fingerprint,
          timestamp,
          screenshot,
          consoleExcerpt,
          networkExcerpt,
        },
      });
    }

    page.on("pageerror", (error: Error) => {
      void report({ type: "js-exception", message: `${error.name}: ${error.message}` });
    });

    page.on("console", (message: ConsoleMessage) => {
      pushBounded(consoleBuffer, `[${message.type()}] ${message.text()}`);
      const candidate = classifyConsoleMessage(message.type(), message.text());
      if (candidate) void report(candidate);
    });

    page.on("response", (response: Response) => {
      const request = response.request();
      pushBounded(networkBuffer, `${request.method()} ${response.url()} => ${response.status()}`);
      const candidate = classifyResponse({
        method: request.method(),
        url: response.url(),
        status: response.status(),
        pageUrl: page.url(),
        targetOrigin,
      });
      if (candidate) void report(candidate);
    });

    page.on("requestfailed", (request: Request) => {
      pushBounded(
        networkBuffer,
        `${request.method()} ${request.url()} => failed (${request.failure()?.errorText ?? "unknown"})`,
      );
    });

    let scanning = false;
    async function scan() {
      if (scanning || page.isClosed()) return;
      const url = page.url();
      if (!isOnOrigin(url, targetOrigin)) {
        streaks = new Map();
        return;
      }
      scanning = true;
      try {
        // A string, not a function: tsx would inject helpers into a function's source.
        const text: unknown = await page.evaluate(
          "document.readyState === 'complete' ? (document.body ? document.body.innerText : '') : null",
        );
        if (typeof text !== "string" || page.url() !== url) return;
        const previousStreaks = streaks;
        streaks = new Map();
        for (const candidate of inspectPageText(url, text)) {
          const key = `${candidate.type}\n${candidate.message}\n${url}`;
          const streak = (previousStreaks.get(key) ?? 0) + 1;
          streaks.set(key, streak);
          if (streak === (CONFIRMATION_SCANS[candidate.type] ?? 1)) await report(candidate);
        }
      } catch {
        // The page navigated or closed during the scan: the next scan sees the new page.
      } finally {
        scanning = false;
      }
    }

    const timer = setInterval(() => void scan(), scanIntervalMs);
    timer.unref();
    page.on("close", () => {
      clearInterval(timer);
    });
    return Promise.resolve();
  };
}

let detectorFromEnv: ReturnType<typeof createHardErrorDetector> | undefined;

/** Entry point of Playwright MCP: configured by the environment of the MCP server (run.ts). */
export default function attachHardErrorDetector({ page }: { page: Page }): Promise<void> {
  const targetOrigin = process.env.MONKEY_TARGET_ORIGIN;
  const outputDir = process.env.MONKEY_HARD_ERRORS_DIR;
  if (!targetOrigin || !outputDir) {
    throw new Error(
      "The hard-error detector needs MONKEY_TARGET_ORIGIN and MONKEY_HARD_ERRORS_DIR",
    );
  }
  detectorFromEnv ??= createHardErrorDetector({ targetOrigin, outputDir });
  return detectorFromEnv({ page });
}

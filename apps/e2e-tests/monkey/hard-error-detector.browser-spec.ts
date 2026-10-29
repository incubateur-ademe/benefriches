/**
 * The hard-error detector on a real browser: pages of a local server inject an exception,
 * a failing request or a visible "NaN". Needs Playwright's Chromium:
 * `pnpm --filter e2e-tests test:monkey-browser`.
 */

import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, afterEach, before, beforeEach, describe, it } from "node:test";

import { chromium, type Browser } from "@playwright/test";

import {
  createHardErrorDetector,
  HARD_ERRORS_FILE_NAME,
  type HardError,
  type HardErrorRecord,
} from "./hard-error-detector";

const PAGES: Record<string, string> = {
  "/exception": `<p>Exception page</p><script>
    console.log("page loaded");
    setTimeout(() => { throw new Error("Injected exception"); }, 50);
  </script>`,
  "/failing-request": `<p>Failing request page</p><script>
    console.log("page loaded");
    fetch("/api/boom", { method: "POST" });
  </script>`,
  "/nan": `<p>Superficie totale</p><p id="surface"></p><script>
    console.log("page loaded");
    document.getElementById("surface").textContent = String(Number("abc")) + " m²";
  </script>`,
  "/healthy": `<p>Mes évaluations</p><script>console.log("page loaded");</script>`,
};

function startServer(): Promise<Server> {
  const server = createServer((request, response) => {
    if (request.url === "/api/boom") {
      response.writeHead(500, { "content-type": "application/json" }).end('{"error":"boom"}');
      return;
    }
    const body = PAGES[request.url ?? ""];
    if (body === undefined) {
      response.writeHead(404).end();
      return;
    }
    response
      .writeHead(200, { "content-type": "text/html; charset=utf-8" })
      .end(`<!doctype html><html><body>${body}</body></html>`);
  });
  return new Promise((resolvePromise) => {
    server.listen(0, "127.0.0.1", () => {
      resolvePromise(server);
    });
  });
}

describe("hard-error detector in a browser", () => {
  let server: Server;
  let browser: Browser;
  let origin: string;
  let outputDir: string;

  before(async () => {
    server = await startServer();
    origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    browser = await chromium.launch();
  });

  after(async () => {
    await browser.close();
    server.close();
  });

  beforeEach(() => {
    outputDir = mkdtempSync(join(tmpdir(), "monkey-hard-errors-"));
  });

  afterEach(() => {
    rmSync(outputDir, { recursive: true });
  });

  function readHardErrors(): HardError[] {
    const logPath = join(outputDir, HARD_ERRORS_FILE_NAME);
    if (!existsSync(logPath)) return [];
    return readFileSync(logPath, "utf8")
      .split("\n")
      .filter((line) => line !== "")
      .map((line) => JSON.parse(line) as HardErrorRecord)
      .flatMap((record) => (record.kind === "hard-error" ? [record.hardError] : []));
  }

  async function visit(path: string, waitMs: number): Promise<HardError[]> {
    const page = await browser.newPage();
    await createHardErrorDetector({ targetOrigin: origin, outputDir, scanIntervalMs: 100 })({
      page,
    });
    await page.goto(`${origin}${path}`);
    await new Promise((resolvePromise) => setTimeout(resolvePromise, waitMs));
    await page.close();
    return readHardErrors();
  }

  function assertScreenshotAndExcerpts(hardError: HardError, path: string) {
    assert.ok(hardError.screenshot, "a screenshot is taken");
    assert.ok(existsSync(join(outputDir, hardError.screenshot)), "the screenshot file exists");
    assert.ok(hardError.consoleExcerpt.includes("[log] page loaded"), "console excerpt");
    assert.ok(hardError.networkExcerpt.includes(`GET ${origin}${path} => 200`), "network excerpt");
    assert.equal(hardError.route, path);
    assert.match(hardError.fingerprint, /^[0-9a-f]{12}$/);
  }

  it("reports an injected exception", async () => {
    const hardErrors = await visit("/exception", 500);

    assert.deepStrictEqual(
      hardErrors.map(({ type, severity, message }) => ({ type, severity, message })),
      [{ type: "js-exception", severity: "major", message: "Error: Injected exception" }],
    );
    assertScreenshotAndExcerpts(hardErrors[0]!, "/exception");
  });

  it("reports a failing request", async () => {
    const hardErrors = await visit("/failing-request", 500);

    assert.deepStrictEqual(
      hardErrors.map(({ type, severity, message }) => ({ type, severity, message })),
      [{ type: "server-error", severity: "major", message: "500 POST /api/boom" }],
    );
    assertScreenshotAndExcerpts(hardErrors[0]!, "/failing-request");
    assert.ok(hardErrors[0]!.networkExcerpt.includes(`POST ${origin}/api/boom => 500`));
  });

  it("reports a visible NaN", async () => {
    const hardErrors = await visit("/nan", 800);

    assert.deepStrictEqual(
      hardErrors.map(({ type, severity, message }) => ({ type, severity, message })),
      [
        {
          type: "broken-text",
          severity: "major",
          message: '"NaN" shown on the page: …Superficie totale NaN m²…',
        },
      ],
    );
    assertScreenshotAndExcerpts(hardErrors[0]!, "/nan");
  });

  it("reports a NaN that stays on the page once, not at every scan", async () => {
    await visit("/nan", 800);

    const records = readFileSync(join(outputDir, HARD_ERRORS_FILE_NAME), "utf8")
      .split("\n")
      .filter((line) => line !== "")
      .map((line) => (JSON.parse(line) as HardErrorRecord).kind);
    assert.deepStrictEqual(records, ["hard-error"]);
  });

  it("reports nothing on a healthy page", async () => {
    const hardErrors = await visit("/healthy", 800);

    assert.deepStrictEqual(hardErrors, []);
  });
});

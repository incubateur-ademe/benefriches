/**
 * Fails the run before any test when the production-like target cannot work: a missing
 * testmail.app variable or an unreachable target URL would otherwise make every test time
 * out.
 */

import { BASE_URL, TARGET_ENV } from "./playwright.config";

const TESTMAIL_VARIABLES = ["E2E_TESTMAIL_NAMESPACE", "E2E_TESTMAIL_API_KEY"] as const;
const REACHABILITY_TIMEOUT_MS = 15_000;

function checkTestmailVariables() {
  const missing = TESTMAIL_VARIABLES.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    throw new Error(
      `E2E_TARGET_ENV=production-like reads emails from testmail.app: set ${missing.join(" and ")}`,
    );
  }
}

async function checkTargetReachable(url: string) {
  let response: Response;
  try {
    response = await fetch(url, { signal: AbortSignal.timeout(REACHABILITY_TIMEOUT_MS) });
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`Target ${url} is unreachable (${reason}): check BASE_URL`, {
      cause: error,
    });
  }
  if (!response.ok) {
    throw new Error(`Target ${url} responded ${response.status}: check BASE_URL`);
  }
}

export default async function globalSetup() {
  if (TARGET_ENV.name !== "production-like") return;

  checkTestmailVariables();
  await checkTargetReachable(BASE_URL);
}

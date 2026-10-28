import { defineConfig, devices } from "@playwright/test";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

import { resolveTargetEnv } from "./target-environment";

// `node adws/env.ts up <slot>` describes its stack in <repo root>/.e2e-stack (BASE_URL,
// MAILCATCHER_URL, ...). Variables already set in the environment win over the file.
const E2E_STACK_FILE = resolve(__dirname, "../../.e2e-stack");
if (existsSync(E2E_STACK_FILE)) process.loadEnvFile(E2E_STACK_FILE);

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3001";
const TARGET_ENV = resolveTargetEnv();
const IS_CI = !!process.env.CI;

function readIntegerEnv(name: string): number | undefined {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return undefined;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`Invalid ${name} "${raw}": expected a non-negative integer`);
  }
  return value;
}

// Playwright accepts a worker count or a percentage of CPU cores ("50%").
function readWorkersEnv(): number | string | undefined {
  const raw = process.env.E2E_WORKERS;
  if (raw !== undefined && /^\d+%$/.test(raw)) return raw;
  return readIntegerEnv("E2E_WORKERS");
}

/**
 * Playwright configuration for E2E tests.
 * Tests run against the stack described by .e2e-stack if present, else the default
 * docker-compose.e2e.yml stack on port 3001 (make e2e-up).
 * E2E_TARGET_ENV selects the target environment (see target-environment.ts). E2E_WORKERS,
 * E2E_RETRIES and E2E_TIMEOUT_MS override the defaults below.
 *
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./tests",
  globalSetup: "./global-setup.ts",
  fullyParallel: true,
  // production-like waits up to 45 s for a real email (testmail-inbox.ts): the test
  // timeout must leave room for that wait to report its own error.
  timeout:
    readIntegerEnv("E2E_TIMEOUT_MS") ?? (TARGET_ENV.name === "production-like" ? 90 : 30) * 1000,
  forbidOnly: IS_CI,
  retries: readIntegerEnv("E2E_RETRIES") ?? (IS_CI ? 2 : 0),
  workers: readWorkersEnv() ?? (IS_CI ? 1 : undefined),
  reporter: IS_CI ? [["github"], ["html", { open: "never" }]] : "html",
  use: {
    baseURL: BASE_URL,
    trace: IS_CI ? "retain-on-failure" : "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});

export { BASE_URL, TARGET_ENV };

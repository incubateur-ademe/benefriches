import { defineConfig, devices } from "@playwright/test";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

// `node adws/env.ts up <slot>` describes its stack in <repo root>/.e2e-stack (BASE_URL,
// MAILCATCHER_URL, ...). Variables already set in the environment win over the file.
const E2E_STACK_FILE = resolve(__dirname, "../../.e2e-stack");
if (existsSync(E2E_STACK_FILE)) process.loadEnvFile(E2E_STACK_FILE);

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3001";
const MAIL_CATCHER_URL =
  process.env.MAILCATCHER_URL ?? `http://localhost:${process.env.MAILCATCHER_UI_PORT ?? "1081"}`;

/**
 * Playwright configuration for E2E tests.
 * Tests run against the stack described by .e2e-stack if present, else the default
 * docker-compose.e2e.yml stack on port 3001 (make e2e-up).
 *
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  timeout: 30 * 1000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});

export { MAIL_CATCHER_URL };

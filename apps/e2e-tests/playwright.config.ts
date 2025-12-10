import { defineConfig, devices } from "@playwright/test";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3001";
const MAIL_CATCHER_URL = process.env.MAIL_CATCHER_URL ?? "http://localhost:1080";

/**
 * Playwright configuration for E2E tests.
 * Tests run against the webapp served by docker-compose.e2e.yml on port 3001.
 *
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
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

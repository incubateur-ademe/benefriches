/**
 * Authentication fixtures for tests requiring a logged-in user.
 * Provides testUser data and an authenticatedPage with valid session cookies.
 */

import { test as base, request, type Page } from "@playwright/test";

// todo: use /api/register body DTO type from shared package
export type TestUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  structureType: string;
  structureActivity: string;
  structureName: string;
};

type AuthFixtures = {
  testUser: TestUser;
  authenticatedPage: Page;
};

/**
 * Creates test user data with a unique email based on prefix and timestamp.
 */
export function createTestUserData(prefix: string): TestUser {
  return {
    id: crypto.randomUUID(),
    email: `e2e-tests-${prefix}-${Date.now()}@mail.com`,
    firstName: "Jean",
    lastName: "Dupont",
    structureType: "other",
    structureActivity: "other",
    structureName: "ADEME",
  };
}

/**
 * Creates a test user via the API registration endpoint.
 * Returns the API response for further processing (e.g., extracting cookies).
 */
export async function createTestUserViaApi(baseURL: string, user: TestUser) {
  const apiContext = await request.newContext({ baseURL });
  const response = await apiContext.post("/api/auth/register", {
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      id: user.id,
      email: user.email,
      firstname: user.firstName,
      lastname: user.lastName,
      structureType: user.structureType,
      structureActivity: user.structureActivity,
      structureName: user.structureName,
      personalDataStorageConsented: true,
      personalDataAnalyticsUseConsented: false,
      personalDataCommunicationUseConsented: false,
      subscribedToNewsletter: false,
    },
  });

  if (!response.ok()) {
    await apiContext.dispose();
    throw new Error(`Failed to create test user: ${response.status()} ${await response.text()}`);
  }

  return { response, apiContext };
}

function parseCookieString(
  setCookieHeader: string,
  baseURL: string,
): { name: string; value: string; domain: string; path: string } | null {
  const parts = setCookieHeader.split(";").map((p) => p.trim());
  const [nameValue] = parts;
  if (!nameValue) return null;

  const [name, value] = nameValue.split("=");
  if (!name || !value) return null;

  const url = new URL(baseURL);
  const domain = url.hostname;

  return {
    name,
    value,
    domain,
    path: "/",
  };
}

export const test = base.extend<AuthFixtures>({
  // @ts-expect-error Playwright requires destructuring even if 'page' is unused
  // oxlint-disable-next-line no-unused-vars
  testUser: async ({ page }, use) => {
    const user = createTestUserData("auth");
    await use(user);
  },

  authenticatedPage: async ({ page, baseURL, testUser }, use) => {
    if (!baseURL) {
      throw new Error("baseURL is required for authenticated fixture");
    }

    // Create user via API and get the response with cookies
    const { response, apiContext } = await createTestUserViaApi(baseURL, testUser);

    // Extract cookies from API response
    const setCookieHeader = response.headers()["set-cookie"];
    if (!setCookieHeader) {
      await apiContext.dispose();
      throw new Error("No set-cookie header in register response");
    }

    // Parse and set cookies on browser context
    const cookie = parseCookieString(setCookieHeader, baseURL);
    if (cookie) {
      await page.context().addCookies([cookie]);
    }

    // Navigate to establish session in browser
    await page.goto("/mes-evaluations");

    await use(page);
    await apiContext.dispose();
  },
});

export { expect } from "@playwright/test";

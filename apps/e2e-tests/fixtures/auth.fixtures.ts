import { test as base, request, type Page } from "@playwright/test";

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

function parseCookieString(
  setCookieHeader: string,
  baseURL: string,
): { name: string; value: string; domain: string; path: string } | null {
  const parts = setCookieHeader.split(";").map((p) => p.trim());
  const [nameValue] = parts;
  if (!nameValue) return null;

  const [name, value] = nameValue.split("=");
  if (!name || !value) return null;

  // Extract domain from baseURL
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
    const userId = crypto.randomUUID();
    const user: TestUser = {
      id: userId,
      email: `e2e-${Date.now()}@mail.com`,
      firstName: "Jean",
      lastName: "Dupont",
      structureType: "other",
      structureActivity: "other",
      structureName: "ADEME",
    };
    await use(user);
  },

  authenticatedPage: async ({ page, baseURL, testUser }, use) => {
    if (!baseURL) {
      throw new Error("baseURL is required for authenticated fixture");
    }

    // 1. Create user via API (this also returns the access_token cookie)
    const apiContext = await request.newContext({ baseURL });
    const response = await apiContext.post("/api/auth/register", {
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        id: testUser.id,
        email: testUser.email,
        firstname: testUser.firstName,
        lastname: testUser.lastName,
        structureType: testUser.structureType,
        structureActivity: testUser.structureActivity,
        structureName: testUser.structureName,
        personalDataStorageConsented: true,
        personalDataAnalyticsUseConsented: false,
        personalDataCommunicationUseConsented: false,
        subscribedToNewsletter: false,
      },
    });

    if (!response.ok()) {
      throw new Error(`Failed to create test user: ${response.status()} ${await response.text()}`);
    }

    // 2. Extract cookies from API response
    const setCookieHeader = response.headers()["set-cookie"];
    if (!setCookieHeader) {
      throw new Error("No set-cookie header in register response");
    }

    // 3. Parse and set cookies on browser context
    const cookie = parseCookieString(setCookieHeader, baseURL);
    if (cookie) {
      await page.context().addCookies([cookie]);
    }

    // 4. Navigate to establish session in browser
    await page.goto("/mes-evaluations");

    await use(page);
    await apiContext.dispose();
  },
});

export { expect } from "@playwright/test";

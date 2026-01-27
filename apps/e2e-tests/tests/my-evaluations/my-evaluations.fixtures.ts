import { request } from "@playwright/test";
import type { CreateCustomSiteDto, CreateExpressSiteDto } from "shared";

import { test as authTest, type TestUser } from "../../fixtures/auth.fixtures";
import { MyEvaluationsPage } from "../../pages/MyEvaluationsPage";

type TestSite = {
  id: string;
  name: string;
  creationMode: "express" | "custom";
};

type MyEvaluationsFixtures = {
  myEvaluationsPage: MyEvaluationsPage;
};

/**
 * Test data for express site creation.
 */
const EXPRESS_SITE_TEST_DATA = {
  surfaceArea: 15000,
  address: {
    city: "Blajan",
    cityCode: "31060",
    postCode: "31350",
    streetNumber: "1",
    long: 0.8463,
    lat: 43.2104,
    banId: "31060",
    value: "Blajan",
  },
  nature: "FRICHE" as const,
  fricheActivity: "INDUSTRY" as const,
};

/**
 * Test data for custom site creation.
 */
const CUSTOM_SITE_TEST_DATA = {
  address: {
    city: "Segré-en-Anjou Bleu",
    cityCode: "49331",
    postCode: "49500",
    streetNumber: "2",
    long: -0.846339,
    lat: 47.710424,
    banId: "49331",
    value: "Segré-en-Anjou Bleu",
  },
  nature: "FRICHE" as const,
  fricheActivity: "RAILWAY" as const,
  soilsDistribution: {
    BUILDINGS: 5000,
    MINERAL_SOIL: 5000,
  },
  yearlyExpenses: [],
  yearlyIncomes: [],
};

/**
 * Helper to create a site via API with common context handling.
 */
async function createSiteViaApi<T>(
  endpoint: string,
  siteData: T,
  baseURL: string,
  cookieHeader: string,
  errorContext: string,
): Promise<void> {
  const apiContext = await request.newContext({
    baseURL,
    extraHTTPHeaders: { Cookie: cookieHeader },
  });

  try {
    const response = await apiContext.post(endpoint, {
      headers: { "Content-Type": "application/json" },
      data: siteData,
    });

    if (!response.ok()) {
      throw new Error(
        `Failed to create ${errorContext}: ${response.status()} ${await response.text()}`,
      );
    }
  } finally {
    await apiContext.dispose();
  }
}

/**
 * Creates an express friche site via the API.
 */
async function createExpressSiteViaApi(
  baseURL: string,
  user: TestUser,
  cookieHeader: string,
  siteName: string,
): Promise<TestSite> {
  const siteId = crypto.randomUUID();

  const siteData: CreateExpressSiteDto = {
    id: siteId,
    createdBy: user.id,
    ...EXPRESS_SITE_TEST_DATA,
  };

  await createSiteViaApi(
    "/api/sites/create-express",
    siteData,
    baseURL,
    cookieHeader,
    `express site for user ${user.id}`,
  );

  return {
    id: siteId,
    name: siteName,
    creationMode: "express",
  };
}

/**
 * Creates a custom friche site via the API.
 */
async function createCustomSiteViaApi(
  baseURL: string,
  user: TestUser,
  cookieHeader: string,
  siteName: string,
): Promise<TestSite> {
  const siteId = crypto.randomUUID();

  const siteData: CreateCustomSiteDto = {
    id: siteId,
    createdBy: user.id,
    name: siteName,
    ...CUSTOM_SITE_TEST_DATA,
  };

  await createSiteViaApi(
    "/api/sites/create-custom",
    siteData,
    baseURL,
    cookieHeader,
    `custom site for user ${user.id}`,
  );

  return {
    id: siteId,
    name: siteName,
    creationMode: "custom",
  };
}

export const test = authTest.extend<MyEvaluationsFixtures>({
  myEvaluationsPage: async ({ authenticatedPage }, use) => {
    const myEvaluationsPage = new MyEvaluationsPage(authenticatedPage);
    await use(myEvaluationsPage);
  },
});

// Extended fixture with two test sites (one express, one custom)
export const testWithSites = test.extend<{ testSites: TestSite[] }>({
  testSites: async ({ baseURL, testUser, authenticatedPage }, use) => {
    if (!baseURL) {
      throw new Error("baseURL is required for test site creation");
    }

    // Extract cookies and format as HTTP Cookie header
    const cookies = await authenticatedPage.context().cookies();
    const cookieHeader = cookies.map((c) => `${c.name}=${c.value}`).join("; ");

    // Create two sites in parallel: one express, one custom
    const [expressSite, customSite] = await Promise.all([
      createExpressSiteViaApi(baseURL, testUser, cookieHeader, "Friche industrielle de Blajan"),
      createCustomSiteViaApi(baseURL, testUser, cookieHeader, "Friche ferroviaire de Segré"),
    ]);

    const testSites = [expressSite, customSite];
    await use(testSites);
  },
});

export { expect } from "@playwright/test";

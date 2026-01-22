import { request } from "@playwright/test";
import type { CreateExpressSiteDto } from "shared";

import { test as authTest, type TestUser } from "../../fixtures/auth.fixtures";
import { UrbanProjectCreationPage } from "../../pages/UrbanProjectCreationPage";

type TestSite = {
  id: string;
  name: string;
};

type UrbanProjectCreationFixtures = {
  urbanProjectCreationPage: UrbanProjectCreationPage;
  testSite: TestSite;
};

/**
 * Creates an express friche site via the API.
 * Returns the site ID for use in project creation tests.
 */
async function createExpressSiteViaApi(
  baseURL: string,
  user: TestUser,
  sessionCookie: string,
): Promise<TestSite> {
  const siteId = crypto.randomUUID();

  const siteData: CreateExpressSiteDto = {
    id: siteId,
    createdBy: user.id,
    surfaceArea: 15000,
    address: {
      city: "Segré-en-Anjou Bleu",
      cityCode: "49331",
      postCode: "49500",
      streetNumber: "1",
      long: -0.846339,
      lat: 47.710424,
      banId: "49331",
      value: "Segré-en-Anjou Bleu",
    },
    nature: "FRICHE",
    fricheActivity: "INDUSTRY",
  };

  const apiContext = await request.newContext({
    baseURL,
    extraHTTPHeaders: {
      Cookie: sessionCookie,
    },
  });

  const response = await apiContext.post("/api/sites/create-express", {
    headers: { "Content-Type": "application/json" },
    data: siteData,
  });

  await apiContext.dispose();

  if (!response.ok()) {
    throw new Error(`Failed to create test site: ${response.status()} ${await response.text()}`);
  }

  return {
    id: siteId,
    name: "Friche industrielle de Segré-en-Anjou Bleu",
  };
}

export const test = authTest.extend<UrbanProjectCreationFixtures>({
  testSite: async ({ baseURL, testUser, authenticatedPage }, use) => {
    if (!baseURL) {
      throw new Error("baseURL is required for test site creation");
    }

    // Extract session cookie from the authenticated page context
    const cookies = await authenticatedPage.context().cookies();
    const sessionCookie = cookies.map((c) => `${c.name}=${c.value}`).join("; ");

    const site = await createExpressSiteViaApi(baseURL, testUser, sessionCookie);
    await use(site);
  },

  urbanProjectCreationPage: async ({ authenticatedPage }, use) => {
    const urbanProjectCreationPage = new UrbanProjectCreationPage(authenticatedPage);
    await use(urbanProjectCreationPage);
  },
});

export { expect } from "@playwright/test";

import { test as authTest } from "../../fixtures/auth.fixtures";
import {
  createExpressSiteViaApi,
  type TestSite,
} from "../../fixtures/helpers/site-creation.helpers";
import { UrbanProjectCreationPage } from "../../pages/UrbanProjectCreationPage";

type UrbanProjectCreationFixtures = {
  urbanProjectCreationPage: UrbanProjectCreationPage;
  testSite: TestSite;
};

export const test = authTest.extend<UrbanProjectCreationFixtures>({
  testSite: async ({ authenticatedApiClient, testUser }, use) => {
    const site = await createExpressSiteViaApi(authenticatedApiClient)({
      createdBy: testUser.id,
      nature: "FRICHE",
      fricheActivity: "INDUSTRY",
      surfaceArea: 12000,
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
    });
    await use(site);
  },

  urbanProjectCreationPage: async ({ authenticatedPage }, use) => {
    const urbanProjectCreationPage = new UrbanProjectCreationPage(authenticatedPage);
    await use(urbanProjectCreationPage);
  },
});

export { expect } from "@playwright/test";

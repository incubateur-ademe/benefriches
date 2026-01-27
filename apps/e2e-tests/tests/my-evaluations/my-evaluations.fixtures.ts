import { test as authTest } from "../../fixtures/auth.fixtures";
import {
  createCustomSiteViaApi,
  createExpressSiteViaApi,
  type FricheCustomSiteDto,
  type TestSite,
} from "../../fixtures/helpers/site-creation.helpers";
import { MyEvaluationsPage } from "../../pages/MyEvaluationsPage";

type MyEvaluationsFixtures = {
  myEvaluationsPage: MyEvaluationsPage;
};

const CUSTOM_SITE_DATA: Omit<FricheCustomSiteDto, "id" | "createdBy"> = {
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
  nature: "FRICHE",
  fricheActivity: "RAILWAY",
  soilsDistribution: {
    BUILDINGS: 5000,
    MINERAL_SOIL: 5000,
  },
  yearlyExpenses: [],
  yearlyIncomes: [],
  name: "Friche ferroviaire de Segré",
};

export const test = authTest.extend<MyEvaluationsFixtures>({
  myEvaluationsPage: async ({ authenticatedPage }, use) => {
    const myEvaluationsPage = new MyEvaluationsPage(authenticatedPage);
    await use(myEvaluationsPage);
  },
});

// Extended fixture with two test sites (one express, one custom)
export const testWithSites = test.extend<{ testSites: TestSite[] }>({
  testSites: async ({ authenticatedApiClient, testUser }, use) => {
    const [expressSite, customSite] = await Promise.all([
      createExpressSiteViaApi(authenticatedApiClient)({
        createdBy: testUser.id,
        nature: "FRICHE",
        fricheActivity: "RAILWAY",
        surfaceArea: 15000,
        address: {
          banId: "31070",
          value: "Blajan",
          city: "Blajan",
          cityCode: "31070",
          postCode: "31350",
          long: 0.652416,
          lat: 43.260128,
        },
      }),
      createCustomSiteViaApi(authenticatedApiClient)({
        ...CUSTOM_SITE_DATA,
        name: "Friche ferroviaire de Segré",
        createdBy: testUser.id,
      }),
    ]);

    const testSites = [expressSite, customSite];
    await use(testSites);
  },
});

export { expect } from "@playwright/test";

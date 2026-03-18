import type { CreateCustomSiteDto } from "shared";

import { test as authTest } from "../../fixtures/auth.fixtures";
import {
  createCustomSiteViaApi,
  type TestSite,
} from "../../fixtures/helpers/site-creation.helpers";
import { PhotovoltaicProjectCreationPage } from "../../pages/PhotovoltaicProjectCreationPage";

type AgriculturalCustomSiteDto = Extract<CreateCustomSiteDto, { nature: "AGRICULTURAL_OPERATION" }>;

const SITE_DATA: Omit<AgriculturalCustomSiteDto, "id" | "createdBy"> = {
  nature: "AGRICULTURAL_OPERATION",
  name: "Terrain agricole de Meylan",
  agriculturalOperationActivity: "CEREALS_AND_OILSEEDS_CULTIVATION",
  isSiteOperated: true,
  address: {
    banId: "38229",
    value: "Meylan",
    city: "Meylan",
    cityCode: "38229",
    postCode: "38240",
    long: 5.7826,
    lat: 45.2116,
  },
  soilsDistribution: {
    BUILDINGS: 1380,
    IMPERMEABLE_SOILS: 920,
    MINERAL_SOIL: 690,
    ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 1150,
    ARTIFICIAL_TREE_FILLED: 460,
  },
  yearlyExpenses: [
    { purpose: "maintenance", amount: 9660, bearer: "owner" },
    { purpose: "propertyTaxes", amount: 6900, bearer: "owner" },
  ],
  yearlyIncomes: [],
  owner: { structureType: "municipality", name: "Mairie de Meylan" },
  tenant: { structureType: "company", name: "Société agricole" },
};

type PhotovoltaicProjectCreationFixtures = {
  pvProjectCreationPage: PhotovoltaicProjectCreationPage;
  testSite: TestSite;
};

export const test = authTest.extend<PhotovoltaicProjectCreationFixtures>({
  testSite: async ({ authenticatedApiClient, testUser }, use) => {
    const site = await createCustomSiteViaApi(authenticatedApiClient)({
      ...SITE_DATA,
      createdBy: testUser.id,
    });
    await use(site);
  },

  pvProjectCreationPage: async ({ authenticatedPage }, use) => {
    const pvProjectCreationPage = new PhotovoltaicProjectCreationPage(authenticatedPage);
    await use(pvProjectCreationPage);
  },
});

export { expect } from "@playwright/test";

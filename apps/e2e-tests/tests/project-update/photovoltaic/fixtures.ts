import type { CreateCustomSiteDto } from "shared";

import { test as authTest } from "../../../fixtures/auth.fixtures";
import {
  createCustomPhotovoltaicProjectViaApi,
  type TestPhotovoltaicProject,
} from "../../../fixtures/helpers/reconversion-project-creation.helpers";
import {
  createCustomSiteViaApi,
  type TestSite,
} from "../../../fixtures/helpers/site-creation.helpers";
import { MyEvaluationsPage } from "../../../pages/MyEvaluationsPage";
import { PhotovoltaicProjectUpdatePage } from "../../../pages/PhotovoltaicProjectUpdatePage";

type AgriculturalCustomSiteDto = Extract<CreateCustomSiteDto, { nature: "AGRICULTURAL_OPERATION" }>;

const AGRICULTURAL_SITE_DATA: Omit<AgriculturalCustomSiteDto, "id" | "createdBy"> = {
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

export const PHOTOVOLTAIC_PROJECT_NAME = "Centrale photovoltaïque de Meylan";
export const ORIGINAL_ELECTRICAL_POWER_KWC = 296;
export const ORIGINAL_MAINTENANCE_EXPENSE_AMOUNT = 8000;

type PhotovoltaicProjectUpdateFixtures = {
  pvProjectUpdatePage: PhotovoltaicProjectUpdatePage;
  agriculturalSite: TestSite;
  photovoltaicProject: TestPhotovoltaicProject;
  myEvaluationsPage: MyEvaluationsPage;
};

export const test = authTest.extend<PhotovoltaicProjectUpdateFixtures>({
  agriculturalSite: async ({ authenticatedApiClient, testUser }, use) => {
    const site = await createCustomSiteViaApi(authenticatedApiClient)({
      ...AGRICULTURAL_SITE_DATA,
      createdBy: testUser.id,
    });
    await use(site);
  },

  photovoltaicProject: async ({ authenticatedApiClient, testUser, agriculturalSite }, use) => {
    const project = await createCustomPhotovoltaicProjectViaApi(authenticatedApiClient)({
      id: crypto.randomUUID(),
      createdBy: testUser.id,
      relatedSiteId: agriculturalSite.id,
      name: PHOTOVOLTAIC_PROJECT_NAME,
      electricalPowerKWc: ORIGINAL_ELECTRICAL_POWER_KWC,
      surfaceArea: 2700,
      expectedAnnualProduction: 374,
      contractDuration: 20,
      yearlyMaintenanceExpenseAmount: ORIGINAL_MAINTENANCE_EXPENSE_AMOUNT,
    });
    await use(project);
  },

  pvProjectUpdatePage: async ({ authenticatedPage }, use) => {
    const pvProjectUpdatePage = new PhotovoltaicProjectUpdatePage(authenticatedPage);
    await use(pvProjectUpdatePage);
  },

  myEvaluationsPage: async ({ authenticatedPage }, use) => {
    const myEvaluationsPage = new MyEvaluationsPage(authenticatedPage);
    await use(myEvaluationsPage);
  },
});

export { expect } from "@playwright/test";

import type { CreateCustomSiteDto } from "shared";

import { test as authTest } from "../../../fixtures/auth.fixtures";
import {
  createCustomUrbanProjectViaApi,
  type TestUrbanProject,
} from "../../../fixtures/helpers/reconversion-project-creation.helpers";
import {
  createCustomSiteViaApi,
  type TestSite,
} from "../../../fixtures/helpers/site-creation.helpers";
import { MyEvaluationsPage } from "../../../pages/MyEvaluationsPage";
import { UrbanProjectUpdatePage } from "../../../pages/UrbanProjectUpdatePage";

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

const URBAN_PROJECT_NAME = "Projet urbain de Meylan";

const BUILDINGS_FLOOR_AREA_DISTRIBUTION = {
  RESIDENTIAL: 250,
  LOCAL_STORE: 250,
  ARTISANAL_OR_INDUSTRIAL_OR_SHIPPING_PREMISES: 250,
  MULTI_STORY_PARKING: 250,
};

type UrbanProjectUpdateFixtures = {
  agriculturalSite: TestSite;
  urbanProject: TestUrbanProject;
  urbanProjectUpdatePage: UrbanProjectUpdatePage;
  myEvaluationsPage: MyEvaluationsPage;
};

export const test = authTest.extend<UrbanProjectUpdateFixtures>({
  agriculturalSite: async ({ authenticatedApiClient, testUser }, use) => {
    const site = await createCustomSiteViaApi(authenticatedApiClient)({
      ...AGRICULTURAL_SITE_DATA,
      createdBy: testUser.id,
    });
    await use(site);
  },

  urbanProject: async ({ authenticatedApiClient, testUser, agriculturalSite }, use) => {
    const project = await createCustomUrbanProjectViaApi(authenticatedApiClient)({
      id: crypto.randomUUID(),
      createdBy: testUser.id,
      relatedSiteId: agriculturalSite.id,
      name: URBAN_PROJECT_NAME,
      buildingsFloorAreaDistribution: BUILDINGS_FLOOR_AREA_DISTRIBUTION,
    });
    await use(project);
  },

  urbanProjectUpdatePage: async ({ authenticatedPage }, use) => {
    const urbanProjectUpdatePage = new UrbanProjectUpdatePage(authenticatedPage);
    await use(urbanProjectUpdatePage);
  },

  myEvaluationsPage: async ({ authenticatedPage }, use) => {
    const myEvaluationsPage = new MyEvaluationsPage(authenticatedPage);
    await use(myEvaluationsPage);
  },
});

export { expect } from "@playwright/test";

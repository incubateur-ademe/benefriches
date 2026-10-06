import type { CreateCustomSiteDto } from "shared";

import { test as authTest } from "../../../fixtures/auth.fixtures";
import {
  createCustomSiteViaApi,
  type TestSite,
} from "../../../fixtures/helpers/site-creation.helpers";
import { PhotovoltaicProjectCreationPage } from "../../../pages/PhotovoltaicProjectCreationPage";

type AgriculturalCustomSiteDto = Extract<CreateCustomSiteDto, { nature: "AGRICULTURAL_OPERATION" }>;
type FricheCustomSiteDto = Extract<CreateCustomSiteDto, { nature: "FRICHE" }>;

const AGRICULTURAL_SITE_DATA: Omit<AgriculturalCustomSiteDto, "id"> = {
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

const FRICHE_SITE_DATA: Omit<FricheCustomSiteDto, "id"> = {
  nature: "FRICHE",
  name: "Friche industrielle de Meylan",
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
    BUILDINGS: 1000,
    IMPERMEABLE_SOILS: 2000,
    MINERAL_SOIL: 1500,
  },
  yearlyExpenses: [],
  yearlyIncomes: [],
  owner: { structureType: "municipality", name: "Mairie de Meylan" },
};

const CONTAMINATED_FRICHE_SITE_DATA: Omit<FricheCustomSiteDto, "id" | "createdBy"> = {
  ...FRICHE_SITE_DATA,
  name: "Friche polluée de Meylan",
  contaminatedSoilSurface: 1000,
};

type PhotovoltaicProjectCreationFixtures = {
  pvProjectCreationPage: PhotovoltaicProjectCreationPage;
  agriculturalSite: TestSite;
  fricheSite: TestSite;
  contaminatedFricheSite: TestSite;
};

export const test = authTest.extend<PhotovoltaicProjectCreationFixtures>({
  agriculturalSite: async ({ authenticatedApiClient }, use) => {
    const site = await createCustomSiteViaApi(authenticatedApiClient)({
      ...AGRICULTURAL_SITE_DATA,
    });
    await use(site);
  },

  fricheSite: async ({ authenticatedApiClient }, use) => {
    const site = await createCustomSiteViaApi(authenticatedApiClient)({
      ...FRICHE_SITE_DATA,
    });
    await use(site);
  },

  contaminatedFricheSite: async ({ authenticatedApiClient }, use) => {
    const site = await createCustomSiteViaApi(authenticatedApiClient)({
      ...CONTAMINATED_FRICHE_SITE_DATA,
    });
    await use(site);
  },

  pvProjectCreationPage: async ({ authenticatedPage }, use) => {
    const pvProjectCreationPage = new PhotovoltaicProjectCreationPage(authenticatedPage);
    await use(pvProjectCreationPage);
  },
});

export { expect } from "@playwright/test";

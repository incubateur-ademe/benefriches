import { test as authTest } from "../../fixtures/auth.fixtures";
import {
  createCustomPhotovoltaicProjectViaApi,
  type TestPhotovoltaicProject,
} from "../../fixtures/helpers/reconversion-project-creation.helpers";
import {
  createCustomSiteViaApi,
  type FricheCustomSiteDto,
  type TestSite,
  type UrbanZoneCustomSiteDto,
} from "../../fixtures/helpers/site-creation.helpers";
import { MyEvaluationsPage } from "../../pages/MyEvaluationsPage";
import { SiteCreationPage } from "../../pages/SiteCreationPage";
import { SiteFeaturesPage } from "../../pages/SiteFeaturesPage";
import { SiteUpdatePage } from "../../pages/SiteUpdatePage";
import { UrbanZoneSiteCreationPage } from "../../pages/UrbanZoneSiteCreationPage";

// A local-authority owner (`municipality`) is required so the ADDRESS handler's dependency
// rules invalidate OWNER on a real commune change — see address.handlers.ts's doc comment. Two
// suitable soils (IMPERMEABLE_SOILS + MINERAL_SOIL) so `SPACES_SELECTION.getNextStepId` does not
// short-circuit to SOILS_CARBON_STORAGE (that shortcut only fires for a single soil type), which
// would make the converter omit the two distribution steps and silently shorten the wizard.
export const FRICHE_SITE_DATA: Omit<FricheCustomSiteDto, "id" | "createdBy"> = {
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
    BUILDINGS: 3000,
    IMPERMEABLE_SOILS: 2000,
    MINERAL_SOIL: 5000,
  },
  contaminatedSoilSurface: 4000,
  yearlyExpenses: [{ purpose: "maintenance", amount: 3000, bearer: "owner" }],
  yearlyIncomes: [],
  owner: { structureType: "municipality", name: "Mairie de Meylan" },
};

// A second, independent friche (own fixture, isolated under `fullyParallel`) so the address
// cascade spec is free to mutate address/owner without interfering with the main edit spec.
export const ADDRESS_CASCADE_SITE_DATA: Omit<FricheCustomSiteDto, "id" | "createdBy"> = {
  ...FRICHE_SITE_DATA,
  name: "Friche cascade adresse de Meylan",
};

export const URBAN_ZONE_SITE_DATA: Omit<UrbanZoneCustomSiteDto, "id" | "createdBy"> = {
  nature: "URBAN_ZONE",
  name: "ZAE de Meylan",
  urbanZoneType: "ECONOMIC_ACTIVITY_ZONE",
  address: {
    banId: "38229",
    value: "Meylan",
    city: "Meylan",
    cityCode: "38229",
    postCode: "38240",
    long: 5.7826,
    lat: 45.2116,
  },
  landParcels: [
    {
      type: "COMMERCIAL_ACTIVITY_AREA",
      surfaceArea: 6000,
      soilsDistribution: { BUILDINGS: 4000, IMPERMEABLE_SOILS: 2000 },
      buildingsFloorSurfaceArea: 3000,
    },
    {
      type: "PUBLIC_SPACES",
      surfaceArea: 4000,
      soilsDistribution: { MINERAL_SOIL: 2500, ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 1500 },
    },
  ],
  hasContaminatedSoils: false,
  manager: { structureType: "local_authority", name: "Mairie de Meylan" },
  vacantCommercialPremisesFootprint: 1200,
  vacantCommercialPremisesFloorArea: 900,
  fullTimeJobsEquivalent: 25,
  yearlyExpenses: [],
  yearlyIncomes: [],
};

export const SITE_WITH_PROJECT_DATA: Omit<FricheCustomSiteDto, "id" | "createdBy"> = {
  nature: "FRICHE",
  name: "Friche avec projet de Meylan",
  address: {
    banId: "38229",
    value: "Meylan",
    city: "Meylan",
    cityCode: "38229",
    postCode: "38240",
    long: 5.7826,
    lat: 45.2116,
  },
  soilsDistribution: { BUILDINGS: 1000, IMPERMEABLE_SOILS: 2000, MINERAL_SOIL: 1500 },
  yearlyExpenses: [],
  yearlyIncomes: [],
  owner: { structureType: "municipality", name: "Mairie de Meylan" },
};

type SiteUpdateFixtures = {
  siteUpdatePage: SiteUpdatePage;
  siteCreationPage: SiteCreationPage;
  urbanZoneSiteCreationPage: UrbanZoneSiteCreationPage;
  myEvaluationsPage: MyEvaluationsPage;
  siteFeaturesPage: SiteFeaturesPage;
  fricheSite: TestSite;
  addressCascadeSite: TestSite;
  urbanZoneSite: TestSite;
  siteWithActiveProject: TestSite;
  photovoltaicProject: TestPhotovoltaicProject;
};

export const test = authTest.extend<SiteUpdateFixtures>({
  siteUpdatePage: async ({ authenticatedPage }, use) => {
    await use(new SiteUpdatePage(authenticatedPage));
  },
  siteCreationPage: async ({ authenticatedPage }, use) => {
    await use(new SiteCreationPage(authenticatedPage));
  },
  urbanZoneSiteCreationPage: async ({ authenticatedPage }, use) => {
    await use(new UrbanZoneSiteCreationPage(authenticatedPage));
  },
  myEvaluationsPage: async ({ authenticatedPage }, use) => {
    await use(new MyEvaluationsPage(authenticatedPage));
  },
  siteFeaturesPage: async ({ authenticatedPage }, use) => {
    await use(new SiteFeaturesPage(authenticatedPage));
  },

  fricheSite: async ({ authenticatedApiClient, testUser }, use) => {
    const site = await createCustomSiteViaApi(authenticatedApiClient)({
      ...FRICHE_SITE_DATA,
      createdBy: testUser.id,
    });
    await use(site);
  },

  addressCascadeSite: async ({ authenticatedApiClient, testUser }, use) => {
    const site = await createCustomSiteViaApi(authenticatedApiClient)({
      ...ADDRESS_CASCADE_SITE_DATA,
      createdBy: testUser.id,
    });
    await use(site);
  },

  urbanZoneSite: async ({ authenticatedApiClient, testUser }, use) => {
    const site = await createCustomSiteViaApi(authenticatedApiClient)({
      ...URBAN_ZONE_SITE_DATA,
      createdBy: testUser.id,
    });
    await use(site);
  },

  siteWithActiveProject: async ({ authenticatedApiClient, testUser }, use) => {
    const site = await createCustomSiteViaApi(authenticatedApiClient)({
      ...SITE_WITH_PROJECT_DATA,
      createdBy: testUser.id,
    });
    await use(site);
  },

  photovoltaicProject: async ({ authenticatedApiClient, testUser, siteWithActiveProject }, use) => {
    const project = await createCustomPhotovoltaicProjectViaApi(authenticatedApiClient)({
      id: crypto.randomUUID(),
      createdBy: testUser.id,
      relatedSiteId: siteWithActiveProject.id,
      name: "Centrale photovoltaïque de Meylan",
      electricalPowerKWc: 296,
      surfaceArea: 2700,
      expectedAnnualProduction: 374,
      contractDuration: 20,
      yearlyMaintenanceExpenseAmount: 8000,
    });
    await use(project);
  },
});

export { expect } from "@playwright/test";

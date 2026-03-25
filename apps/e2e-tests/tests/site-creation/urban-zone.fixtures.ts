import { test as authTest } from "../../fixtures/auth.fixtures";
import { MyEvaluationsPage } from "../../pages/MyEvaluationsPage";
import { SiteCreationPage } from "../../pages/SiteCreationPage";
import { SiteFeaturesPage } from "../../pages/SiteFeaturesPage";
import { UrbanZoneSiteCreationPage } from "../../pages/UrbanZoneSiteCreationPage";

type UrbanZoneSiteCreationFixtures = {
  myEvaluationsPage: MyEvaluationsPage;
  siteCreationPage: SiteCreationPage;
  siteFeaturesPage: SiteFeaturesPage;
  urbanZoneSiteCreationPage: UrbanZoneSiteCreationPage;
};

export const test = authTest.extend<UrbanZoneSiteCreationFixtures>({
  myEvaluationsPage: async ({ authenticatedPage }, use) => {
    await use(new MyEvaluationsPage(authenticatedPage));
  },
  siteCreationPage: async ({ authenticatedPage }, use) => {
    await use(new SiteCreationPage(authenticatedPage));
  },
  siteFeaturesPage: async ({ authenticatedPage }, use) => {
    await use(new SiteFeaturesPage(authenticatedPage));
  },
  urbanZoneSiteCreationPage: async ({ authenticatedPage }, use) => {
    await use(new UrbanZoneSiteCreationPage(authenticatedPage));
  },
});

export { expect } from "@playwright/test";

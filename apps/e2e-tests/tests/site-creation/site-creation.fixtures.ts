import { test as authTest } from "../../fixtures/auth.fixtures";
import { MyEvaluationsPage } from "../../pages/MyEvaluationsPage";
import { SiteCreationPage } from "../../pages/SiteCreationPage";
import { SiteFeaturesPage } from "../../pages/SiteFeaturesPage";

type SiteCreationFixtures = {
  myEvaluationsPage: MyEvaluationsPage;
  siteCreationPage: SiteCreationPage;
  siteFeaturesPage: SiteFeaturesPage;
};

export const test = authTest.extend<SiteCreationFixtures>({
  myEvaluationsPage: async ({ authenticatedPage }, use) => {
    await use(new MyEvaluationsPage(authenticatedPage));
  },
  siteCreationPage: async ({ authenticatedPage }, use) => {
    const siteCreationPage = new SiteCreationPage(authenticatedPage);
    await use(siteCreationPage);
  },
  siteFeaturesPage: async ({ authenticatedPage }, use) => {
    await use(new SiteFeaturesPage(authenticatedPage));
  },
});

export { expect } from "@playwright/test";

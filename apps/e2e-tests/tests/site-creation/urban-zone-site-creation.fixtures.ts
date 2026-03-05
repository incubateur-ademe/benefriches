import { test as authTest } from "../../fixtures/auth.fixtures";
import { SiteCreationPage } from "../../pages/SiteCreationPage";
import { UrbanZoneSiteCreationPage } from "../../pages/UrbanZoneSiteCreationPage";

type UrbanZoneSiteCreationFixtures = {
  siteCreationPage: SiteCreationPage;
  urbanZoneSiteCreationPage: UrbanZoneSiteCreationPage;
};

export const test = authTest.extend<UrbanZoneSiteCreationFixtures>({
  siteCreationPage: async ({ authenticatedPage }, use) => {
    await use(new SiteCreationPage(authenticatedPage));
  },
  urbanZoneSiteCreationPage: async ({ authenticatedPage }, use) => {
    await use(new UrbanZoneSiteCreationPage(authenticatedPage));
  },
});

export { expect } from "@playwright/test";

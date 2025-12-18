import { test as authTest } from "../../fixtures/auth.fixtures";
import { SiteCreationPage } from "../../pages/SiteCreationPage";

type SiteCreationFixtures = {
  siteCreationPage: SiteCreationPage;
};

export const test = authTest.extend<SiteCreationFixtures>({
  siteCreationPage: async ({ authenticatedPage }, use) => {
    const siteCreationPage = new SiteCreationPage(authenticatedPage);
    await use(siteCreationPage);
  },
});

export { expect } from "@playwright/test";

import { test as base } from "@playwright/test";

import { HomePage } from "../pages/HomePage";
import { AccessBenefrichesPage } from "../pages/AccessBenefrichesPage";
import { SignupPage } from "../pages/SignupPage";

export type TestUser = {
  email: string;
  firstName: string;
  lastName: string;
  structureType: string;
  structureName: string;
};

type Fixtures = {
  testUser: TestUser;
  homePage: HomePage;
  accessBenefrichesPage: AccessBenefrichesPage;
  signupPage: SignupPage;
};

export const test = base.extend<Fixtures>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },
  accessBenefrichesPage: async ({ page }, use) => {
    const accessBenefrichesPage = new AccessBenefrichesPage(page);
    await use(accessBenefrichesPage);
  },
  signupPage: async ({ page }, use) => {
    const signupPage = new SignupPage(page);
    await use(signupPage);
  },
  // @ts-expect-error Playwright requires destructuring even if 'page' is unused
  // oxlint-disable-next-line no-unused-vars
  testUser: async ({ page }, use) => {
    const user: TestUser = {
      email: `e2e-test-user-${Date.now()}@mail.com`,
      firstName: "Jean",
      lastName: "Doe",
      structureType: "other",
      structureName: "ADEME",
    };
    await use(user);
  },
});

export { expect } from "@playwright/test";

/**
 * Login test fixtures.
 * Composes page objects and provides a pre-registered test user whose emails the
 * `mailInbox` can read.
 */

import { AccessBenefrichesPage } from "../../pages/AccessBenefrichesPage";
import { HomePage } from "../../pages/HomePage";
import { LoginModal } from "../../pages/LoginPage";
import { createTestUserData, createTestUserViaApi, TestUser } from "../../fixtures/auth.fixtures";
import { test as base } from "../../fixtures/mail-inbox.fixtures";

type LoginFixtures = {
  testUser: TestUser;
  homePage: HomePage;
  accessBenefrichesPage: AccessBenefrichesPage;
  loginModal: LoginModal;
};

export const test = base.extend<LoginFixtures>({
  loginModal: async ({ page }, use) => {
    const loginModal = new LoginModal(page);
    await use(loginModal);
  },
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },
  accessBenefrichesPage: async ({ page }, use) => {
    const accessBenefrichesPage = new AccessBenefrichesPage(page);
    await use(accessBenefrichesPage);
  },

  testUser: async ({ baseURL, mailInbox }, use) => {
    if (!baseURL) {
      throw new Error("baseURL is required for login fixture");
    }

    const user = createTestUserData("login", await mailInbox.create("login"));
    const { apiContext } = await createTestUserViaApi(baseURL, user);

    await use(user);
    await apiContext.dispose();
  },
});

export { expect } from "@playwright/test";

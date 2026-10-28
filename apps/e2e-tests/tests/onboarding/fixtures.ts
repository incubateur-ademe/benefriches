/**
 * Onboarding test fixtures.
 * `test` creates a fresh, unregistered user for flows that go through signup, with an
 * address the `mailInbox` can read.
 */

import { createTestUserData, TestUser } from "../../fixtures/auth.fixtures";
import { test as base } from "../../fixtures/mail-inbox.fixtures";
import { SignupPage } from "../../pages/SignupPage";
import { HomePage } from "../../pages/HomePage";
import { AccessBenefrichesPage } from "../../pages/AccessBenefrichesPage";
import { OnboardingStepPage } from "../../pages/OnboardingStepPage";
import { OnboardingLegacyFlowPage } from "../../pages/OnboardingLegacyFlowPage";

type OnboardingFixtures = {
  testUser: TestUser;
  homePage: HomePage;
  accessBenefrichesPage: AccessBenefrichesPage;
  signupPage: SignupPage;
  onboardingStepPage: OnboardingStepPage;
  onboardingLegacyFlowPage: OnboardingLegacyFlowPage;
};

export const test = base.extend<OnboardingFixtures>({
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
  onboardingStepPage: async ({ page }, use) => {
    await use(new OnboardingStepPage(page));
  },
  onboardingLegacyFlowPage: async ({ page }, use) => {
    await use(new OnboardingLegacyFlowPage(page));
  },

  testUser: async ({ mailInbox }, use) => {
    // Create user data only - not registered via API
    // The onboarding tests will register the user through the UI
    const user = createTestUserData("onboarding", await mailInbox.create("onboarding"));
    await use(user);
  },
});

export { expect } from "@playwright/test";

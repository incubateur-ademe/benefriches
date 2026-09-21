/**
 * Onboarding test fixtures.
 * `test` creates a fresh, unregistered user for flows that go through signup.
 */

import { test as base } from "@playwright/test";
import { createTestUserData, TestUser } from "../../fixtures/auth.fixtures";
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

  // @ts-expect-error Playwright requires destructuring even if 'page' is unused
  // oxlint-disable-next-line no-unused-vars
  testUser: async ({ page }, use) => {
    // Create user data only - not registered via API
    // The onboarding tests will register the user through the UI
    const user = createTestUserData("onboarding");
    await use(user);
  },
});

export { expect } from "@playwright/test";

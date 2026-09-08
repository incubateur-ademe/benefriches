import { test as authTest } from "../../fixtures/auth.fixtures";
import { OnboardingStepPage } from "../../pages/OnboardingStepPage";

type OnboardingStepsFixtures = {
  onboardingStepPage: OnboardingStepPage;
};

export const test = authTest.extend<OnboardingStepsFixtures>({
  onboardingStepPage: async ({ authenticatedPage }, use) => {
    const onboardingStepPage = new OnboardingStepPage(authenticatedPage);
    await use(onboardingStepPage);
  },
});

export { expect } from "@playwright/test";

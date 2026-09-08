import { test, expect } from "./onboarding-steps.fixtures";

test.describe("onboarding step shell", () => {
  test("allows an authenticated user to navigate directly to each new step URL, and to move back and forth between steps", async ({
    onboardingStepPage,
  }) => {
    // Step 1 (bienvenue), reached directly by URL: shell renders, no Retour, Suivant forward button
    await onboardingStepPage.goto("bienvenue");
    await onboardingStepPage.expectCurrentStep("bienvenue");
    await onboardingStepPage.expectShellVisible();
    await onboardingStepPage.expectNoBackButton();
    await expect(onboardingStepPage.forwardButton("Suivant")).toBeVisible();

    // Suivant moves to step 2 (methodologie): Retour appears, forward button still Suivant
    await onboardingStepPage.clickForward("Suivant");
    await onboardingStepPage.expectCurrentStep("methodologie");
    await onboardingStepPage.expectBackButtonVisible();
    await expect(onboardingStepPage.forwardButton("Suivant")).toBeVisible();

    // Retour moves back to step 1 (bienvenue), which again has no Retour button
    await onboardingStepPage.clickBack();
    await onboardingStepPage.expectCurrentStep("bienvenue");
    await onboardingStepPage.expectNoBackButton();

    // Suivant twice reaches step 3 (temoignages): Retour appears, forward button reads Commencer
    await onboardingStepPage.clickForward("Suivant");
    await onboardingStepPage.expectCurrentStep("methodologie");
    await onboardingStepPage.clickForward("Suivant");
    await onboardingStepPage.expectCurrentStep("temoignages");
    await onboardingStepPage.expectBackButtonVisible();
    await expect(onboardingStepPage.forwardButton("Commencer")).toBeVisible();

    // Retour from step 3 moves back to step 2 (methodologie)
    await onboardingStepPage.clickBack();
    await onboardingStepPage.expectCurrentStep("methodologie");

    // Suivant moves forward to step 3 again, and Commencer navigates to "Mes évaluations"
    await onboardingStepPage.clickForward("Suivant");
    await onboardingStepPage.expectCurrentStep("temoignages");
    await onboardingStepPage.clickForward("Commencer");

    await expect(onboardingStepPage.page).toHaveURL((url) => url.pathname === "/mes-evaluations");
  });
});

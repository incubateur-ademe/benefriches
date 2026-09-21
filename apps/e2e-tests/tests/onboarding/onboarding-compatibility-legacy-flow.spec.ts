import { test, expect } from "./fixtures";

/**
 * The "Analyser la compatibilité de ma friche" CTA (evaluation-mutabilite entry
 * point) still goes through the OLD 3-page onboarding flow (when-to-use /
 * when-not-to-use / how-it-works), unlike every other entry point which now uses
 * the new step-shell flow covered in `onboarding.spec.ts`. See
 * `OnboardingLegacyFlowPage` for the page object.
 */
test.describe("onboarding (legacy flow, compatibility evaluation entry point)", () => {
  test("allows new user to create account, complete onboarding, and land on compatibility analysis", async ({
    page,
    testUser,
    homePage,
    accessBenefrichesPage,
    signupPage,
    onboardingLegacyFlowPage,
  }) => {
    // Navigate to homepage and start compatibility flow
    await homePage.goto();
    await expect(
      page.getByRole("heading", { name: "Je souhaite évaluer... la compatibilité de ma friche" }),
    ).toBeVisible();

    await homePage.clickAnalyzeCompatibility();

    // Unauthenticated user is redirected to sign up before reaching onboarding
    await accessBenefrichesPage.expectCurrentPage();
    await accessBenefrichesPage.clickCreateAccount();

    await signupPage.expectCurrentPage();
    await signupPage.completeSignup(testUser);

    // Complete the legacy onboarding steps
    await onboardingLegacyFlowPage.completeAllSteps("evaluation-mutabilite");

    // Verify landing on compatibility analysis page
    await expect(page).toHaveURL((url) => url.pathname === "/evaluer-compatibilite-friche");
    await expect(
      page.getByRole("heading", { name: "Analyse de la compatibilité de la friche" }),
    ).toBeVisible();
  });
});

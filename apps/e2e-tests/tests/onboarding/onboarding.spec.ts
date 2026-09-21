import { test, expect } from "./fixtures";

test.describe("onboarding", () => {
  test.describe("from the homepage hero CTA", () => {
    test("allows new user to create account, complete onboarding, and land on evaluations", async ({
      page,
      homePage,
      accessBenefrichesPage,
      signupPage,
      testUser,
      onboardingStepPage,
    }) => {
      // Navigate to homepage and click "Commencer"
      await homePage.goto();
      await homePage.clickGetStarted();

      // Land on "Accéder à Bénéfriches" and create an account
      await accessBenefrichesPage.expectCurrentPage();
      await accessBenefrichesPage.clickCreateAccount();

      // Create account
      await signupPage.expectCurrentPage();
      await signupPage.completeSignup(testUser);

      // Complete onboarding steps
      await onboardingStepPage.completeAllSteps(
        `Bonjour, ${testUser.firstName} ${testUser.lastName} !`,
      );

      // Verify landing on evaluations page
      await expect(page).toHaveURL((url) => url.pathname === "/mes-evaluations");
      await expect(page.getByText("Mes évaluations")).toBeVisible();
    });
  });

  test.describe("from the header CTA", () => {
    test("allows new user to create account, complete onboarding, and land on evaluations", async ({
      page,
      homePage,
      accessBenefrichesPage,
      signupPage,
      testUser,
      onboardingStepPage,
    }) => {
      // Navigate to homepage and click header "Accéder à Bénéfriches"
      await homePage.goto();
      await homePage.clickAccessBenefriches();

      // Land on "Accéder à Bénéfriches" and create an account
      await accessBenefrichesPage.expectCurrentPage();
      await accessBenefrichesPage.clickCreateAccount();

      // Create account
      await signupPage.expectCurrentPage();
      await signupPage.completeSignup(testUser);

      // Walk into onboarding, then go back one step mid-flow before continuing
      const welcomeHeading = `Bonjour, ${testUser.firstName} ${testUser.lastName} !`;
      await onboardingStepPage.expectCurrentStep("bienvenue");
      await onboardingStepPage.expectHeadingVisible(welcomeHeading);
      await onboardingStepPage.expectNoBackButton();
      await onboardingStepPage.clickForward("Suivant");

      await onboardingStepPage.expectMethodologyStep();
      await onboardingStepPage.expectBackButtonVisible();
      await onboardingStepPage.clickBack();

      await onboardingStepPage.expectCurrentStep("bienvenue");
      await onboardingStepPage.expectNoBackButton();

      // Complete onboarding steps normally
      await onboardingStepPage.completeAllSteps(welcomeHeading);

      // Verify landing on evaluations page
      await expect(page).toHaveURL((url) => url.pathname === "/mes-evaluations");
      await expect(page.getByText("Mes évaluations")).toBeVisible();
    });
  });

  test.describe("from the impacts evaluation CTA", () => {
    test("allows new user to create account, complete onboarding, and land on the impacts form", async ({
      page,
      testUser,
      homePage,
      accessBenefrichesPage,
      signupPage,
      onboardingStepPage,
    }) => {
      // Navigate to homepage and start impacts flow
      await homePage.goto();
      await expect(
        page.getByRole("heading", {
          name: "Je souhaite évaluer... Les impacts socio-économiques d’un projet sur mon site",
        }),
      ).toBeVisible();

      await homePage.clickEvaluateImpacts();

      // Create account
      await accessBenefrichesPage.expectCurrentPage();
      await accessBenefrichesPage.clickCreateAccount();

      await signupPage.expectCurrentPage();
      await signupPage.completeSignup(testUser);

      // Walk into onboarding, reloading mid-flow to verify the step and variant survive
      const welcomeHeading = `Bonjour, ${testUser.firstName} ${testUser.lastName} !`;
      await onboardingStepPage.expectCurrentStep("bienvenue");
      await onboardingStepPage.expectHeadingVisible(welcomeHeading);
      await onboardingStepPage.expectStepProgress(1, 3);
      await onboardingStepPage.clickForward("Suivant");

      await onboardingStepPage.expectMethodologyStep();
      await onboardingStepPage.expectCurrentStepVariant("evaluation-impacts");

      await onboardingStepPage.reload();

      await onboardingStepPage.expectMethodologyStep();
      await onboardingStepPage.expectCurrentStepVariant("evaluation-impacts");

      // Continue onboarding steps normally
      await onboardingStepPage.expectStepProgress(2, 3);
      await onboardingStepPage.expectBackButtonVisible();
      await onboardingStepPage.expectForwardLabel("Suivant");
      await onboardingStepPage.clickForward("Suivant");

      await onboardingStepPage.expectTestimonialsStep();
      await onboardingStepPage.expectStepProgress(3, 3);
      await onboardingStepPage.expectForwardLabel("Commencer");
      await onboardingStepPage.clickForward("Commencer");

      // Verify landing on form page, with the variant applied
      await onboardingStepPage.expectExitedToImpactsForm();
      await expect(page).toHaveURL((url) => {
        const params = url.searchParams;
        return params.get("etape") === "mode-de-creation";
      });
      await expect(page.getByText("Renseignement du site")).toBeVisible();
      await expect(
        page.getByRole("heading", { name: "Que souhaitez-vous évaluer ?" }),
      ).toBeVisible();
    });
  });
});

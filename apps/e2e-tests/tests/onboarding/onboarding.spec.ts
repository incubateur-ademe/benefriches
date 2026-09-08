import { test, expect } from "./onboarding.fixtures";

const WELCOME_HEADING = "Bonjour, je suis Mintsa !";
const METHODOLOGY_HEADING = "Une méthodologie éprouvée";
const TESTIMONIALS_HEADING = "Ils ont testé et approuvé Bénéfriches";

test.describe("onboarding", () => {
  test("main call to action: allows new user to create account and complete onboarding", async ({
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
    await onboardingStepPage.expectCurrentStep("bienvenue");
    await onboardingStepPage.expectHeadingVisible(WELCOME_HEADING);
    await onboardingStepPage.clickForward("Suivant");

    await onboardingStepPage.expectCurrentStep("methodologie");
    await onboardingStepPage.expectHeadingVisible(METHODOLOGY_HEADING);
    await onboardingStepPage.clickForward("Suivant");

    await onboardingStepPage.expectCurrentStep("temoignages");
    await onboardingStepPage.expectHeadingVisible(TESTIMONIALS_HEADING);
    await onboardingStepPage.clickForward("Commencer");

    // Verify landing on site creation page
    await expect(page).toHaveURL((url) => url.pathname === "/mes-evaluations");
    await expect(page.getByText("Mes évaluations")).toBeVisible();
  });

  test("compatibility evaluation: allows new user to create account and complete onboarding", async ({
    page,
    testUser,
    homePage,
    accessBenefrichesPage,
    signupPage,
    onboardingStepPage,
  }) => {
    // Navigate to homepage and start compatibility flow
    await homePage.goto();
    await expect(
      page.getByRole("heading", { name: "Je souhaite évaluer... la compatibilité de ma friche" }),
    ).toBeVisible();

    await homePage.clickAnalyzeCompatibility();

    // Create account
    await accessBenefrichesPage.expectCurrentPage();
    await accessBenefrichesPage.clickCreateAccount();

    await signupPage.expectCurrentPage();
    await signupPage.completeSignup(testUser);

    // Complete onboarding steps
    await onboardingStepPage.expectCurrentStep("bienvenue");
    await onboardingStepPage.expectHeadingVisible(WELCOME_HEADING);
    await onboardingStepPage.clickForward("Suivant");

    await onboardingStepPage.expectCurrentStep("methodologie");
    await onboardingStepPage.expectHeadingVisible(METHODOLOGY_HEADING);
    await onboardingStepPage.clickForward("Suivant");

    await onboardingStepPage.expectCurrentStep("temoignages");
    await onboardingStepPage.expectHeadingVisible(TESTIMONIALS_HEADING);
    await onboardingStepPage.clickForward("Commencer");

    // Verify landing on compatibility analysis page
    await expect(page.getByRole("heading", { name: "Analyse de la compatibilité" })).toBeVisible();
  });

  test("impacts evaluation: allows new user to create account and complete onboarding", async ({
    page,
    testUser,
    homePage,
    accessBenefrichesPage,
    signupPage,
    onboardingStepPage,
  }) => {
    // Navigate to homepage and start compatibility flow
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

    // Complete onboarding steps
    await onboardingStepPage.expectCurrentStep("bienvenue");
    await onboardingStepPage.expectHeadingVisible(WELCOME_HEADING);
    await onboardingStepPage.clickForward("Suivant");

    await onboardingStepPage.expectCurrentStep("methodologie");
    await onboardingStepPage.expectHeadingVisible(METHODOLOGY_HEADING);
    await onboardingStepPage.clickForward("Suivant");

    await onboardingStepPage.expectCurrentStep("temoignages");
    await onboardingStepPage.expectHeadingVisible(TESTIMONIALS_HEADING);
    await onboardingStepPage.clickForward("Commencer");

    // Verify landing on form page
    await expect(page).toHaveURL((url) => url.pathname === "/creer-site-foncier");
    await expect(page).toHaveURL((url) => {
      const params = url.searchParams;
      return (
        params.get("etape") === "mode-de-creation" && params.get("evaluationMode") === "impacts"
      );
    });
    await expect(page.getByText("Renseignement du site")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Que souhaitez-vous évaluer ?" })).toBeVisible();
  });
});

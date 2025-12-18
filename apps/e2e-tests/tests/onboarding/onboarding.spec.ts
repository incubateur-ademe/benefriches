import { test, expect } from "./onboarding.fixtures";

test.describe("Onboarding", () => {
  test("Impact evaluation: allows new user to create account and complete onboarding", async ({
    page,
    homePage,
    accessBenefrichesPage,
    signupPage,
    testUser,
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
    await expect(page).toHaveURL(
      (url) => url.pathname === "/premiers-pas/quand-utiliser-benefriches",
    );

    await page.getByRole("link", { name: "Suivant" }).click();

    await expect(page).toHaveURL(
      (url) => url.pathname === "/premiers-pas/quand-ne-pas-utiliser-benefriches",
    );

    await page.getByRole("button", { name: "Suivant" }).click();

    await expect(page).toHaveURL((url) => url.pathname === "/premiers-pas/comment-ca-marche");

    await page.getByRole("button", { name: "C'est parti" }).click();

    // Verify landing on site creation page
    await expect(page).toHaveURL((url) => url.pathname === "/creer-site-foncier");
    await expect(page.getByText("Votre site est-il une friche")).toBeVisible();
  });

  test("Compatibility evaluation: allows new user to create account and complete onboarding", async ({
    page,
    testUser,
    homePage,
    accessBenefrichesPage,
    signupPage,
  }) => {
    // Navigate to homepage and start compatibility flow
    await homePage.goto();
    await expect(
      page.getByText("J'ai une friche et je souhaite trouver l'usage le plus adapté."),
    ).toBeVisible();
    await homePage.clickAnalyzeCompatibility();

    // Create account
    await accessBenefrichesPage.expectCurrentPage();
    await accessBenefrichesPage.clickCreateAccount();

    await signupPage.expectCurrentPage();
    await signupPage.completeSignup(testUser);

    // Complete onboarding steps
    await expect(page.getByRole("heading", { name: "Bienvenue sur Bénéfriches !" })).toBeVisible();

    await page.getByRole("link", { name: "Suivant" }).click();

    await expect(page.getByRole("heading", { name: "En revanche, Bénéfriches n'" })).toBeVisible();

    await page.getByRole("button", { name: "Suivant" }).click();

    await expect(page.getByRole("heading", { name: "Bénéfriches, comment ça" })).toBeVisible();

    await page.getByRole("button", { name: "C'est parti" }).click();

    // Verify landing on compatibility analysis page
    await expect(page.getByRole("heading", { name: "Analyse de la compatibilité" })).toBeVisible();
  });
});

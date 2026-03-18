import { test, expect, waitForEmail, getMessagePlainText } from "./login.fixtures";

test.describe("login with email", () => {
  test("shows error when user enters unknown email", async ({
    homePage,
    accessBenefrichesPage,
    loginModal,
  }) => {
    const unknownEmail = `unknown-${Date.now()}@mail.com`;

    // Navigate to homepage and click "Accéder à Bénéfriches"
    await homePage.goto();
    await homePage.clickAccessBenefriches();

    // Land on "Accéder à Bénéfriches" login/signup page
    await accessBenefrichesPage.expectCurrentPage();

    // Click "Continuer avec mon adresse e-mail"
    await accessBenefrichesPage.clickContinueWithEmail();

    // Expect login modal to be visible
    await loginModal.expectVisible();

    // Fill in unknown email address
    await loginModal.fillEmail(unknownEmail);

    // Click "Recevoir un lien"
    await loginModal.clickReceiveLink();

    // Check that error message is displayed
    await loginModal.expectUnknownEmailError();
  });

  test("allows existing user to log in via email", async ({
    page,
    homePage,
    accessBenefrichesPage,
    loginModal,
    testUser,
  }) => {
    // Navigate to homepage and click "Commencer"
    await homePage.goto();
    await homePage.clickAccessBenefriches();

    // Land on "Accéder à Bénéfriches" login/signup page
    await accessBenefrichesPage.expectCurrentPage();

    // Click "Continuer avec mon adresse e-mail"
    await accessBenefrichesPage.clickContinueWithEmail();

    // Expect login modal to be visible
    await loginModal.expectVisible();

    // Fill in email address
    await loginModal.fillEmail(testUser.email);

    // Click "Recevoir un lien"
    await loginModal.clickReceiveLink();

    // Check that success message is displayed
    await loginModal.expectSuccessMessage();

    // Wait for the login email to arrive in MailCatcher
    const loginEmail = await waitForEmail(testUser.email);

    // Fetch email plain text to extract login link
    const loginEmailPlainText = await getMessagePlainText(loginEmail.id);
    const urlMatch = loginEmailPlainText.match(/https?:\/\/[^\s]+/);
    const authLink = urlMatch?.[0];

    expect(authLink, "Authentication link should be found in email").toBeDefined();

    // Navigate to the authentication link
    await page.goto(authLink as string);

    // Expect to be logged in and redirected to "Mes évaluations" page
    await expect(page).toHaveURL((url) => url.pathname === "/mes-evaluations");
    await expect(page.getByRole("heading", { name: "Mes évaluations" })).toBeVisible();
  });
});

import {
  test,
  expect,
  getMailCatcherMessages,
  getMailCatcherMessagePlainText,
} from "../fixtures/login.fixtures";

test.describe("Login with email", () => {
  test("shows error when user enters unknown email", async ({
    homePage,
    accessBenefrichesPage,
    loginPage,
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
    await loginPage.expectVisible();

    // Fill in unknown email address
    await loginPage.fillEmail(unknownEmail);

    // Click "Recevoir un lien"
    await loginPage.clickReceiveLink();

    // Check that error message is displayed
    await loginPage.expectUnknownEmailError();
  });

  test("allows existing user to log in via email", async ({
    page,
    homePage,
    accessBenefrichesPage,
    loginPage,
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
    await loginPage.expectVisible();

    // Fill in email address
    await loginPage.fillEmail(testUser.email);

    // Click "Recevoir un lien"
    await loginPage.clickReceiveLink();

    // Check that success message is displayed
    await loginPage.expectSuccessMessage();

    // Wait a bit for the email to be sent
    await page.waitForTimeout(100);

    // look for the email in MailCatcher
    const messages = await getMailCatcherMessages();
    const loginEmailInList = messages.find((msg) =>
      msg.recipients.some((recipient) => recipient.includes(testUser.email)),
    );
    expect(loginEmailInList).toBeDefined();

    // fetch email plain text to extract login link
    const loginEmailPlainText = await getMailCatcherMessagePlainText(loginEmailInList!.id);
    const urlMatch = loginEmailPlainText.match(/https?:\/\/[^\s]+/);
    const authLink = urlMatch?.[0];

    // Navigate to the authentication link
    await page.goto(authLink!);

    // Expect to be logged in and redirected to "Mes évaluations" page
    await expect(page).toHaveURL((url) => url.pathname === "/mes-evaluations");
    await expect(page.getByRole("heading", { name: "Mes évaluations" })).toBeVisible();
  });
});

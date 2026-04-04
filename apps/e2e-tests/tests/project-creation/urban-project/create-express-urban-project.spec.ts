import { test } from "./fixtures";

test.describe("urban project creation - Express mode", () => {
  test("allows authenticated user to create an urban project via express mode", async ({
    urbanProjectCreationPage,
    testSite,
  }) => {
    // Navigate to project creation with the test site
    await urbanProjectCreationPage.goto(testSite.id);

    // Express sites auto-skip to demo flow (no project phase or creation mode steps)

    // Urban project template selection step
    await urbanProjectCreationPage.selectUrbanProjectTemplate("PUBLIC_FACILITIES");

    // Summary step
    await urbanProjectCreationPage.expectSummaryStepWithDataInList([
      ["Type d'aménagement", "Autre projet d'aménagement"],
      ["Nom du projet", "Équipement public"],
    ]);
    await urbanProjectCreationPage.submitSummary();

    // Creation result
    await urbanProjectCreationPage.expectCreationSuccess("Équipement public");

    // View important info (onboarding)
    await urbanProjectCreationPage.clickViewImportantInfo();
    await urbanProjectCreationPage.expectOnboardingStep1();
  });
});

import { test } from "./urban-project-creation.fixtures";

test.describe("Urban project creation - Express mode", () => {
  test("allows authenticated user to create an urban project via express mode", async ({
    urbanProjectCreationPage,
    testSite,
  }) => {
    // Navigate to project creation with the test site
    await urbanProjectCreationPage.goto(testSite.id);

    // Introduction step
    await urbanProjectCreationPage.expectIntroductionStep(testSite.name);
    await urbanProjectCreationPage.clickStart();

    // Project type selection step
    await urbanProjectCreationPage.selectProjectType("URBAN_PROJECT");

    // Create mode selection step
    await urbanProjectCreationPage.selectCreateMode("express");

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

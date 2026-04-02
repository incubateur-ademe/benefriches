import { test } from "./fixtures";

test.describe("urban project creation - with mutability results in url", () => {
  test("displays projectSuggestions with compatibility score in demo template form view", async ({
    urbanProjectCreationPage,
    testSite,
  }) => {
    // Navigate to project creation with the test site
    await urbanProjectCreationPage.gotoWithProjectSuggestions(testSite.id);

    // --- Project phase ---
    await urbanProjectCreationPage.selectProjectPhase("Montage / Développement");

    await urbanProjectCreationPage.selectCreateMode("express");

    // Urban project template selection step
    await urbanProjectCreationPage.expectDemoProjectOptionWithCompatibilityBadge(
      "RESIDENTIAL_NORMAL_AREA",
      "43% Défavorable",
    );
    await urbanProjectCreationPage.selectUrbanProjectTemplate("RESIDENTIAL_NORMAL_AREA");

    // Summary step
    await urbanProjectCreationPage.expectSummaryStepWithDataInList([
      ["Type d'aménagement", "Autre projet d'aménagement"],
      ["Nom du projet", "Résidentiel secteur détendu"],
    ]);
    await urbanProjectCreationPage.submitSummary();

    // Creation result
    await urbanProjectCreationPage.expectCreationSuccess("Résidentiel secteur détendu");

    // View important info (onboarding)
    await urbanProjectCreationPage.clickViewImportantInfo();
    await urbanProjectCreationPage.expectOnboardingStep1();
  });
});

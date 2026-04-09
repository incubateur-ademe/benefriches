import { test } from "../fixtures";

test.describe("site creation - agricultural operation - express mode", () => {
  test("allows authenticated user to create an agricultural site via express mode", async ({
    myEvaluationsPage,
    siteCreationPage,
    siteFeaturesPage,
  }) => {
    await siteCreationPage.goto();

    await siteCreationPage.selectCreateMode("express");

    await siteCreationPage.expectDemoIntroductionStep();
    await siteCreationPage.expectStepperCurrentStep("Introduction");
    await siteCreationPage.clickStart();

    await siteCreationPage.selectSiteNature("AGRICULTURAL_OPERATION");

    await siteCreationPage.expectStepTitle("De quel type d'exploitation agricole s'agit-il");
    await siteCreationPage.expectStepperCurrentStep("Type de site");
    await siteCreationPage.selectAgriculturalActivity("POLYCULTURE_AND_LIVESTOCK");

    await siteCreationPage.expectStepTitle("Où est située l'exploitation agricole ?");
    await siteCreationPage.expectStepperCurrentStep("Adresse");
    await siteCreationPage.fillAddress("Lyon");

    await siteCreationPage.expectStepTitle("Quelle est la superficie totale de l'exploitation ?");
    await siteCreationPage.expectStepperCurrentStep("Superficie");
    await siteCreationPage.fillSurfaceArea(50000);

    await siteCreationPage.expectCreationSuccessWithDataInList([
      ["Type d'exploitation", "Polyculture / polyélevage"],
      ["Superficie totale du site", "50 000 ㎡"],
      ["Adresse", "Lyon"],
    ]);
    await siteCreationPage.expectExpressCreationDisclaimer();
    await siteCreationPage.hideExpressCreationDisclaimer();
    await siteCreationPage.expectCreateDemoProjectLink();

    await myEvaluationsPage.goto();
    await myEvaluationsPage.expectCurrentPage();
    await myEvaluationsPage.openFirstSiteFeatures();

    await siteFeaturesPage.expectCurrentPage();
    await siteFeaturesPage.expectFeaturesDataLines([
      ["Adresse du site", "Lyon"],
      ["Type d'exploitation", "Polyculture / polyélevage"],
    ]);
  });
});

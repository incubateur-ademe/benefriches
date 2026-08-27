import { asSquareMeters } from "../../../fixtures/helpers/format.helpers";
import { test } from "../fixtures";

test.describe("site creation - friche - express mode", () => {
  test("allows authenticated user to create a friche site via express mode", async ({
    myEvaluationsPage,
    siteCreationPage,
    siteFeaturesPage,
  }) => {
    await siteCreationPage.goto();

    await siteCreationPage.selectCreateMode("express");

    await siteCreationPage.expectDemoIntroductionStep();
    await siteCreationPage.expectStepperCurrentStep("Introduction");
    await siteCreationPage.clickStart();

    await siteCreationPage.selectSiteNature("FRICHE");

    await siteCreationPage.expectStepTitle("De quel type de friche s'agit-il ?");
    await siteCreationPage.expectStepperCurrentStep("Type de site");
    await siteCreationPage.expectWizardAriaSnapshot("friche-express-activity-step.aria.yml");
    await siteCreationPage.selectFricheActivity("INDUSTRY");

    await siteCreationPage.expectStepTitle("Où est située la friche ?");
    await siteCreationPage.expectStepperCurrentStep("Adresse");
    await siteCreationPage.expectWizardAriaSnapshot("friche-express-address-step.aria.yml");
    await siteCreationPage.fillAddress("Blajan");

    await siteCreationPage.expectStepTitle("Quelle est la superficie totale de la friche ?");
    await siteCreationPage.expectStepperCurrentStep("Superficie");
    await siteCreationPage.expectWizardAriaSnapshot("friche-express-surface-area-step.aria.yml");
    await siteCreationPage.fillSurfaceArea(10000);

    await siteCreationPage.expectCreationSuccessWithDataInList([
      ["Type de friche", "Friche industrielle"],
      ["Superficie totale du site", asSquareMeters(10_000)],
      ["Adresse", "Blajan"],
    ]);

    await siteCreationPage.expectWizardAriaSnapshot("friche-express-creation-result-step.aria.yml");
    await siteCreationPage.expectExpressCreationDisclaimer();
    await siteCreationPage.hideExpressCreationDisclaimer();
    await siteCreationPage.expectCreateDemoProjectLink();

    await myEvaluationsPage.goto();
    await myEvaluationsPage.expectCurrentPage();
    await myEvaluationsPage.openFirstSiteFeatures();

    await siteFeaturesPage.expectCurrentPage();
    await siteFeaturesPage.expectFeaturesDataLines([
      ["Adresse du site", "Blajan"],
      ["Type de friche", "Friche industrielle"],
    ]);
  });
});

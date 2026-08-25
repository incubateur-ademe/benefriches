import { asSquareMeters } from "../../../fixtures/helpers/format.helpers";
import { test } from "../fixtures";

test.describe("site creation - natural area - express mode", () => {
  test("allows authenticated user to create a natural area site via express mode", async ({
    myEvaluationsPage,
    siteCreationPage,
    siteFeaturesPage,
  }) => {
    await siteCreationPage.goto();

    await siteCreationPage.selectCreateMode("express");

    await siteCreationPage.expectDemoIntroductionStep();
    await siteCreationPage.expectStepperCurrentStep("Introduction");
    await siteCreationPage.clickStart();

    await siteCreationPage.selectSiteNature("NATURAL_AREA");

    await siteCreationPage.expectStepTitle("De quel type d'espace naturel s'agit-il ?");
    await siteCreationPage.expectStepperCurrentStep("Type de site");
    await siteCreationPage.expectWizardAriaSnapshot("natural-area-express-type-step.aria.yml");
    await siteCreationPage.selectNaturalAreaType("FOREST");

    await siteCreationPage.expectStepTitle("Où est situé l'espace naturel ?");
    await siteCreationPage.expectStepperCurrentStep("Adresse");
    await siteCreationPage.expectWizardAriaSnapshot("natural-area-express-address-step.aria.yml");
    await siteCreationPage.fillAddress("Fontainebleau");

    await siteCreationPage.expectStepTitle("Quelle est la superficie totale de l'espace naturel ?");
    await siteCreationPage.expectStepperCurrentStep("Superficie");
    await siteCreationPage.expectWizardAriaSnapshot(
      "natural-area-express-surface-area-step.aria.yml",
    );
    await siteCreationPage.fillSurfaceArea(25000);

    await siteCreationPage.expectCreationSuccessWithDataInList([
      ["Nature du site", "Forêt"],
      ["Superficie totale du site", asSquareMeters(25_000)],
      ["Adresse", "Fontainebleau"],
    ]);
    await siteCreationPage.expectWizardAriaSnapshot(
      "natural-area-express-creation-result-step.aria.yml",
    );
    await siteCreationPage.expectExpressCreationDisclaimer();
    await siteCreationPage.hideExpressCreationDisclaimer();
    await siteCreationPage.expectCreateDemoProjectLink();

    await myEvaluationsPage.goto();
    await myEvaluationsPage.expectCurrentPage();
    await myEvaluationsPage.openFirstSiteFeatures();

    await siteFeaturesPage.expectCurrentPage();
    await siteFeaturesPage.expectFeaturesDataLines([
      ["Adresse du site", "Fontainebleau"],
      ["Nature du site", "Forêt"],
    ]);
  });
});

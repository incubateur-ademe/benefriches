import { asSquareMeters } from "../../../fixtures/helpers/format.helpers";
import { test } from "../fixtures";

test.describe("site creation - natural area - custom mode", () => {
  test("allows authenticated user to create a natural area site via custom mode", async ({
    myEvaluationsPage,
    siteCreationPage,
    siteFeaturesPage,
  }) => {
    await siteCreationPage.goto();

    await siteCreationPage.selectCreateMode("custom");

    await siteCreationPage.expectIntroductionStep();
    await siteCreationPage.clickStart();

    await siteCreationPage.selectIsFriche("no");
    await siteCreationPage.selectSiteNature("NATURAL_AREA");

    await siteCreationPage.expectStepTitle("De quel type d'espace naturel s'agit-il ?");
    await siteCreationPage.expectStepperCurrentStep("Introduction");
    await siteCreationPage.expectWizardAriaSnapshot("natural-area-custom-type-step.aria.yml");
    await siteCreationPage.selectNaturalAreaType("FOREST");

    await siteCreationPage.expectStepTitle("Où est situé l'espace naturel ?");
    await siteCreationPage.expectStepperCurrentStep("Adresse");
    await siteCreationPage.expectWizardAriaSnapshot("natural-area-custom-address-step.aria.yml");
    await siteCreationPage.fillAddress("Blajan");

    await siteCreationPage.expectStepTitle(
      "Parlons d'abord des espaces qui existent actuellement sur l'espace naturel.",
    );
    await siteCreationPage.expectStepperCurrentStep("Espaces");
    await siteCreationPage.goToNextStep();

    await siteCreationPage.expectStepTitle("Quelle est la superficie totale de l'espace naturel ?");
    await siteCreationPage.expectStepperCurrentStep("Espaces");
    await siteCreationPage.fillSurfaceArea(20_000);

    await siteCreationPage.expectStepTitle(
      "Connaissez-vous les types d'espaces présents sur l'espace naturel ?",
    );
    await siteCreationPage.expectStepperCurrentStep("Espaces");
    await siteCreationPage.selectSpacesKnowledge("yes");

    await siteCreationPage.expectStepTitle("Quels types d'espaces y a-t-il sur l'espace naturel ?");
    await siteCreationPage.expectStepperCurrentStep("Espaces");
    await siteCreationPage.expectWizardAriaSnapshot(
      "natural-area-custom-spaces-selection-step.aria.yml",
    );
    await siteCreationPage.selectSpaces(["FOREST_DECIDUOUS", "PRAIRIE_GRASS"]);

    await siteCreationPage.expectStepTitle(
      "Connaissez-vous les superficies des différents espaces de l'espace naturel ?",
    );
    await siteCreationPage.expectStepperCurrentStep("Espaces");
    await siteCreationPage.selectSpacesDistributionKnowledge("yes");

    await siteCreationPage.expectStepTitle("Quelle superficie font les différents espaces ?");
    await siteCreationPage.expectStepperCurrentStep("Espaces");
    await siteCreationPage.expectWizardAriaSnapshot(
      "natural-area-custom-spaces-distribution-step.aria.yml",
    );
    await siteCreationPage.fillSpacesDistribution({
      FOREST_DECIDUOUS: 15_000,
      PRAIRIE_GRASS: 5_000,
    });

    await siteCreationPage.expectStepTitle("Récapitulatif de l'occupation des sols");
    await siteCreationPage.expectStepperCurrentStep("Espaces");
    await siteCreationPage.goToNextStep();

    await siteCreationPage.expectStepTitle("Stockage du carbone par les sols");
    await siteCreationPage.expectStepperCurrentStep("Espaces");
    await siteCreationPage.goToNextStep();

    // Natural area skips contamination/accidents (friche-only) and goes straight
    // to site management.
    await siteCreationPage.expectStepTitle("Un ou plusieurs acteurs sont liés à l'espace naturel");
    await siteCreationPage.expectStepperCurrentStep("Gestion du site");
    await siteCreationPage.goToNextStep();

    await siteCreationPage.expectStepTitle("Qui est le propriétaire actuel de l'espace naturel");
    await siteCreationPage.expectStepperCurrentStep("Gestion du site");
    await siteCreationPage.expectWizardAriaSnapshot("natural-area-custom-owner-step.aria.yml");
    await siteCreationPage.selectOwnerLocalAuthority("Mairie de Blajan");

    // Natural area also skips leased/operated/tenant/expenses/income (owner
    // goes straight to naming for this nature).
    await siteCreationPage.expectStepTitle("Quelle est l'identité de ce site ?");
    await siteCreationPage.expectStepperCurrentStep("Dénomination");
    await siteCreationPage.goToNextStep();

    await siteCreationPage.expectStepTitle("Dénomination du site");
    await siteCreationPage.expectStepperCurrentStep("Dénomination");
    await siteCreationPage.fillSiteNameAndDescription("Forêt de Blajan");

    await siteCreationPage.expectStepperCurrentStep("Récapitulatif");
    await siteCreationPage.expectFinalSummary();
    await siteCreationPage.expectWizardAriaSnapshot(
      "natural-area-custom-final-summary-step.aria.yml",
    );

    await siteCreationPage.expectCreationSuccessWithDataInList([
      ["Superficie totale du site", asSquareMeters(20_000)],
      ["Propriétaire actuel", "Mairie de Blajan"],
      ["Nature du site", "Forêt"],
      ["Nom du site", "Forêt de Blajan"],
    ]);

    await siteCreationPage.createSite();

    await siteCreationPage.expectCreationSuccess("Forêt de Blajan");
    await siteCreationPage.expectCreateProjectLink();

    await myEvaluationsPage.goto();
    await myEvaluationsPage.expectCurrentPage();
    await myEvaluationsPage.openSiteFeatures("Forêt de Blajan");

    await siteFeaturesPage.expectCurrentPage();
    await siteFeaturesPage.expectSiteHeading("Forêt de Blajan");
    await siteFeaturesPage.expectFeaturesDataLines([
      ["Nom du site", "Forêt de Blajan"],
      ["Nature du site", "Forêt"],
      ["Adresse du site", "Blajan"],
      ["Propriétaire actuel", "Mairie de Blajan"],
      ["Forêt de feuillus", asSquareMeters(15_000)],
      ["Prairie herbacée", asSquareMeters(5_000)],
    ]);
  });
});

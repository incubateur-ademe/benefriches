import { test } from "../fixtures";

test.describe("site creation - agricultural operation - custom mode", () => {
  test("allows authenticated user to create an agricultural site via custom mode", async ({
    myEvaluationsPage,
    siteCreationPage,
    siteFeaturesPage,
  }) => {
    await siteCreationPage.goto();

    await siteCreationPage.selectCreateMode("custom");

    await siteCreationPage.expectIntroductionStep();
    await siteCreationPage.clickStart();

    await siteCreationPage.selectIsFriche("no");
    await siteCreationPage.selectSiteNature("AGRICULTURAL_OPERATION");

    await siteCreationPage.expectStepTitle("De quel type d'exploitation agricole s'agit-il");
    await siteCreationPage.expectStepperCurrentStep("Introduction");
    await siteCreationPage.selectAgriculturalActivity("CEREALS_AND_OILSEEDS_CULTIVATION");

    await siteCreationPage.expectStepTitle("Où est située l'exploitation agricole ?");
    await siteCreationPage.expectStepperCurrentStep("Adresse");
    await siteCreationPage.fillAddress("Chartres");

    await siteCreationPage.expectStepTitle(
      "Parlons d'abord des espaces qui existent actuellement sur l'exploitation.",
    );
    await siteCreationPage.expectStepperCurrentStep("Espaces");
    await siteCreationPage.goToNextStep();

    await siteCreationPage.expectStepTitle("Quelle est la superficie totale de l'exploitation ?");
    await siteCreationPage.expectStepperCurrentStep("Espaces");
    await siteCreationPage.fillSurfaceArea(25_000);

    await siteCreationPage.expectStepTitle(
      "Connaissez-vous les types d'espaces présents sur l'exploitation ?",
    );
    await siteCreationPage.expectStepperCurrentStep("Espaces");
    await siteCreationPage.selectSpacesKnowledge("yes");

    await siteCreationPage.expectStepTitle("Quels types d'espaces y a-t-il sur l'exploitation ?");
    await siteCreationPage.expectStepperCurrentStep("Espaces");
    await siteCreationPage.selectSpaces([
      "CULTIVATION",
      "PRAIRIE_GRASS",
      "PRAIRIE_BUSHES",
      "BUILDINGS",
    ]);

    await siteCreationPage.expectStepTitle(
      "Connaissez-vous les superficies des différents espaces de l'exploitation ?",
    );
    await siteCreationPage.expectStepperCurrentStep("Espaces");
    await siteCreationPage.selectSpacesDistributionKnowledge("yes");

    await siteCreationPage.expectStepTitle("Quelle superficie font les différents espaces ?");
    await siteCreationPage.expectStepperCurrentStep("Espaces");
    await siteCreationPage.fillSpacesDistribution({
      CULTIVATION: 20_000,
      PRAIRIE_GRASS: 2_500,
      PRAIRIE_BUSHES: 1_000,
      BUILDINGS: 1_500,
    });

    await siteCreationPage.expectStepTitle("Récapitulatif de l'occupation des sols");
    await siteCreationPage.expectStepperCurrentStep("Espaces");
    await siteCreationPage.goToNextStep();

    await siteCreationPage.expectStepTitle("Stockage du carbone par les sols");
    await siteCreationPage.expectStepperCurrentStep("Espaces");
    await siteCreationPage.goToNextStep();

    await siteCreationPage.expectStepTitle("Un ou plusieurs acteurs sont liés à l'exploitation");
    await siteCreationPage.expectStepperCurrentStep("Gestion du site");
    await siteCreationPage.goToNextStep();

    await siteCreationPage.expectStepTitle("Qui est le propriétaire actuel de l'exploitation");
    await siteCreationPage.expectStepperCurrentStep("Gestion du site");
    await siteCreationPage.selectOwnerLocalAuthority("Mairie de Chartres");

    await siteCreationPage.expectStepTitle("L'exploitation agricole est-elle encore en activité ?");
    await siteCreationPage.expectStepperCurrentStep("Gestion du site");
    await siteCreationPage.selectIsSiteOperated("yes");

    await siteCreationPage.expectStepTitle("Qui est l'exploitant ?");
    await siteCreationPage.expectStepperCurrentStep("Gestion du site");
    await siteCreationPage.selectOperatorAsSiteOwner();

    await siteCreationPage.expectStepTitle(
      "Cette exploitation agricole génère certainement des dépenses et des recettes.",
    );
    await siteCreationPage.expectStepperCurrentStep("Gestion du site");
    await siteCreationPage.goToNextStep();

    await siteCreationPage.expectStepTitle("Dépenses annuelles liées à l'exploitation");
    await siteCreationPage.expectStepperCurrentStep("Gestion du site");
    await siteCreationPage.submitExpenses();

    await siteCreationPage.expectStepTitle("Recettes annuelles liées à l'exploitation");
    await siteCreationPage.expectStepperCurrentStep("Gestion du site");
    await siteCreationPage.submitIncome();

    await siteCreationPage.expectStepTitle(
      "Récapitulatif des dépenses et recettes liées à l'exploitation",
    );
    await siteCreationPage.expectStepperCurrentStep("Gestion du site");
    await siteCreationPage.goToNextStep();

    await siteCreationPage.expectStepTitle("Quelle est l'identité de ce site ?");
    await siteCreationPage.expectStepperCurrentStep("Dénomination");
    await siteCreationPage.goToNextStep();

    await siteCreationPage.expectStepTitle("Dénomination du site");
    await siteCreationPage.expectStepperCurrentStep("Dénomination");
    await siteCreationPage.fillSiteNameAndDescription("Exploitation céréalière de Chartres");

    await siteCreationPage.expectStepperCurrentStep("Récapitulatif");
    await siteCreationPage.expectFinalSummary();

    await siteCreationPage.expectCreationSuccessWithDataInList([
      ["Superficie totale du site", "25 000 ㎡"],
      ["Propriétaire actuel", "Mairie de Chartres"],
      ["Type d'exploitation", "Grandes cultures de céréales et oléagineux"],
      ["Nom du site", "Exploitation céréalière de Chartres"],
    ]);

    await siteCreationPage.createSite();

    await siteCreationPage.expectCreationSuccess("Exploitation céréalière de Chartres");
    await siteCreationPage.expectCreateProjectLink();

    await myEvaluationsPage.goto();
    await myEvaluationsPage.expectCurrentPage();
    await myEvaluationsPage.openSiteFeatures("Exploitation céréalière de Chartres");

    await siteFeaturesPage.expectCurrentPage();
    await siteFeaturesPage.expectSiteHeading("Exploitation céréalière de Chartres");
    await siteFeaturesPage.expectFeaturesDataLines([
      ["Nom du site", "Exploitation céréalière de Chartres"],
      ["Type d'exploitation", "Grandes cultures de céréales et oléagineux"],
      ["Adresse du site", "Chartres"],
      ["Propriétaire actuel", "Mairie de Chartres"],
      ["Culture", "20 000 ㎡"],
      ["Prairie herbacée", "2 500 ㎡"],
      ["Prairie arbustive", "1 000 ㎡"],
      ["Bâtiments", "1 500 ㎡"],
    ]);
  });
});

import { test } from "./site-creation.fixtures";

test.describe("site creation (custom mode)", () => {
  test("allows authenticated user to create a friche site via custom mode", async ({
    myEvaluationsPage,
    siteCreationPage,
    siteFeaturesPage,
  }) => {
    // Navigate to site creation page
    await siteCreationPage.goto();

    // Introduction step
    await siteCreationPage.expectIntroductionStep();
    await siteCreationPage.clickStart();

    // Votre site est-il une friche ?
    await siteCreationPage.selectIsFriche("yes");

    // Que souhaitez-vous évaluer ?
    await siteCreationPage.selectWhatToEvaluate("impacts");

    // Mode de création
    await siteCreationPage.selectCreateMode("custom");

    // Type de friche
    await siteCreationPage.expectStepTitle("De quel type de friche s'agit-il ?");
    await siteCreationPage.expectStepperCurrentStep("Introduction");
    await siteCreationPage.selectFricheActivity("INDUSTRY");

    // Adresse
    await siteCreationPage.expectStepTitle("Où est située la friche ?");
    await siteCreationPage.expectStepperCurrentStep("Adresse");
    await siteCreationPage.fillAddress("Sendere Blajan");

    // --- Espaces et sols ---

    // Introduction espaces
    await siteCreationPage.expectStepTitle(
      "Parlons d'abord des espaces qui existent actuellement sur la friche.",
    );
    await siteCreationPage.expectStepperCurrentStep("Espaces");
    await siteCreationPage.goToNextStep();

    // Surface du site
    await siteCreationPage.expectStepTitle("Quelle est la superficie totale de la friche ?");
    await siteCreationPage.expectStepperCurrentStep("Espaces");
    await siteCreationPage.fillSurfaceArea(10_000);

    // Connaissance des espaces
    await siteCreationPage.expectStepTitle(
      "Connaissez-vous les types d'espaces présents sur la friche ?",
    );
    await siteCreationPage.expectStepperCurrentStep("Espaces");
    await siteCreationPage.selectSpacesKnowledge("yes");

    // Sélection des types d'espaces
    await siteCreationPage.expectStepTitle("Quels types d'espaces y a-t-il sur la friche ?");
    await siteCreationPage.expectStepperCurrentStep("Espaces");
    await siteCreationPage.selectSpaces([
      "BUILDINGS",
      "IMPERMEABLE_SOILS",
      "MINERAL_SOIL",
      "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
    ]);

    // Connaissance des superficies
    await siteCreationPage.expectStepTitle(
      "Connaissez-vous les superficies des différents espaces de la friche ?",
    );
    await siteCreationPage.expectStepperCurrentStep("Espaces");
    await siteCreationPage.selectSpacesDistributionKnowledge("yes");

    // Distribution des superficies
    await siteCreationPage.expectStepTitle("Quelle superficie font les différents espaces ?");
    await siteCreationPage.expectStepperCurrentStep("Espaces");
    await siteCreationPage.fillSpacesDistribution({
      BUILDINGS: 3000,
      IMPERMEABLE_SOILS: 2000,
      MINERAL_SOIL: 3000,
      ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 2000,
    });

    // Récapitulatif des sols
    await siteCreationPage.expectStepTitle("Récapitulatif de l'occupation des sols");
    await siteCreationPage.expectStepperCurrentStep("Espaces");
    await siteCreationPage.goToNextStep();

    // Stockage carbone
    await siteCreationPage.expectStepTitle("Stockage du carbone par les sols");
    await siteCreationPage.expectStepperCurrentStep("Espaces");
    await siteCreationPage.goToNextStep();

    // --- Pollution ---

    // Introduction pollution
    await siteCreationPage.expectStepTitle("La friche est peut-être polluée.");
    await siteCreationPage.expectStepperCurrentStep("Pollution et accidents");
    await siteCreationPage.goToNextStep();

    // Pollution des sols (buildings 3000 + impermeable 2000 = 5000)
    await siteCreationPage.expectStepTitle("Les sols de la friche sont-ils pollués ?");
    await siteCreationPage.expectStepperCurrentStep("Pollution et accidents");
    await siteCreationPage.selectSoilsContamination("yes", 5000);

    // --- Accidents ---

    // Introduction accidents
    await siteCreationPage.expectStepTitle("Des accidents peuvent survenir sur la friche");
    await siteCreationPage.expectStepperCurrentStep("Pollution et accidents");
    await siteCreationPage.goToNextStep();

    // Pas d'accidents
    await siteCreationPage.expectStepTitle(
      "Y a-t-il eu des accidents sur la friche ces 5 dernières années ?",
    );
    await siteCreationPage.expectStepperCurrentStep("Pollution et accidents");
    await siteCreationPage.selectFricheAccidents("no");

    // --- Gestion du site ---

    // Introduction gestion
    await siteCreationPage.expectStepTitle("Un ou plusieurs acteurs sont liés à la friche");
    await siteCreationPage.expectStepperCurrentStep("Gestion du site");
    await siteCreationPage.goToNextStep();

    // Propriétaire : Mairie de Blajan
    await siteCreationPage.expectStepTitle("Qui est le propriétaire actuel de la friche");
    await siteCreationPage.expectStepperCurrentStep("Gestion du site");
    await siteCreationPage.selectOwnerLocalAuthority("Mairie de Blajan");

    // La friche n'est pas louée
    await siteCreationPage.expectStepTitle("La friche est-elle encore louée ?");
    await siteCreationPage.expectStepperCurrentStep("Gestion du site");
    await siteCreationPage.selectIsFricheLeased("no");

    // --- Dépenses ---

    // Introduction dépenses
    await siteCreationPage.expectStepTitle("La friche engendre des dépenses");
    await siteCreationPage.expectStepperCurrentStep("Gestion du site");
    await siteCreationPage.goToNextStep();

    // Dépenses annuelles - laisser les valeurs pré-calculées
    await siteCreationPage.expectStepTitle("Dépenses annuelles liées à la friche");
    await siteCreationPage.expectStepperCurrentStep("Gestion du site");
    await siteCreationPage.submitExpenses();

    // Récapitulatif dépenses
    await siteCreationPage.expectStepTitle(
      "Récapitulatif des dépenses annuelles liées à la friche",
    );
    await siteCreationPage.expectStepperCurrentStep("Gestion du site");
    await siteCreationPage.goToNextStep();

    // --- Dénomination ---

    // Introduction dénomination
    await siteCreationPage.expectStepTitle("Quelle est l'identité de ce site ?");
    await siteCreationPage.expectStepperCurrentStep("Dénomination");
    await siteCreationPage.goToNextStep();

    // Nom et description
    await siteCreationPage.expectStepTitle("Dénomination du site");
    await siteCreationPage.expectStepperCurrentStep("Dénomination");
    await siteCreationPage.fillSiteNameAndDescription("Friche industrielle de Blajan");

    // --- Récapitulatif final ---
    await siteCreationPage.expectStepperCurrentStep("Récapitulatif");
    await siteCreationPage.expectFinalSummary();

    // Vérifier les données saisies dans le récapitulatif
    await siteCreationPage.expectCreationSuccessWithDataInList([
      ["Superficie totale du site", "10 000 ㎡"],
      ["Superficie polluée", "5 000 ㎡"],
      ["Propriétaire actuel", "Mairie de Blajan"],
      ["Type de friche", "Friche industrielle"],
      ["Nom du site", "Friche industrielle de Blajan"],
    ]);

    // Créer le site
    await siteCreationPage.createSite();

    // Vérifier le succès
    await siteCreationPage.expectCreationSuccess("Friche industrielle de Blajan");
    await siteCreationPage.expectCreateProjectLink();

    await myEvaluationsPage.goto();
    await myEvaluationsPage.expectCurrentPage();
    await myEvaluationsPage.openSiteFeatures("Friche industrielle de Blajan");

    await siteFeaturesPage.expectCurrentPage();
    await siteFeaturesPage.expectSiteHeading("Friche industrielle de Blajan");
    await siteFeaturesPage.expectFeaturesDataLines([
      ["Nom du site", "Friche industrielle de Blajan"],
      ["Type de friche", "Friche industrielle"],
      ["Propriétaire actuel", "Mairie de Blajan"],
      ["Superficie polluée", "5 000 ㎡"],
      ["Accidents survenus sur le site depuis 5 ans", "Aucun"],
      ["Bâtiments", "3 000 ㎡"],
      ["Sols imperméabilisés", "2 000 ㎡"],
      ["Sols perméables minéraux", "3 000 ㎡"],
      ["Sols enherbés et arbustifs", "2 000 ㎡"],
    ]);
  });

  test("allows authenticated user to create an agricultural site via custom mode", async ({
    myEvaluationsPage,
    siteCreationPage,
    siteFeaturesPage,
  }) => {
    // Navigate to site creation page
    await siteCreationPage.goto();

    // Introduction step
    await siteCreationPage.expectIntroductionStep();
    await siteCreationPage.clickStart();

    // Votre site est-il une friche ?
    await siteCreationPage.selectIsFriche("no");

    // Quel est le type de site ?
    await siteCreationPage.selectSiteNature("AGRICULTURAL_OPERATION");

    // Mode de création
    await siteCreationPage.selectCreateMode("custom");

    // Type d'exploitation agricole
    await siteCreationPage.expectStepTitle("De quel type d'exploitation agricole s'agit-il");
    await siteCreationPage.expectStepperCurrentStep("Introduction");
    await siteCreationPage.selectAgriculturalActivity("CEREALS_AND_OILSEEDS_CULTIVATION");

    // Adresse
    await siteCreationPage.expectStepTitle("Où est située l'exploitation agricole ?");
    await siteCreationPage.expectStepperCurrentStep("Adresse");
    await siteCreationPage.fillAddress("Chartres");

    // --- Espaces et sols ---

    // Introduction espaces
    await siteCreationPage.expectStepTitle(
      "Parlons d'abord des espaces qui existent actuellement sur l'exploitation.",
    );
    await siteCreationPage.expectStepperCurrentStep("Espaces");
    await siteCreationPage.goToNextStep();

    // Surface du site
    await siteCreationPage.expectStepTitle("Quelle est la superficie totale de l'exploitation ?");
    await siteCreationPage.expectStepperCurrentStep("Espaces");
    await siteCreationPage.fillSurfaceArea(25_000);

    // Connaissance des espaces
    await siteCreationPage.expectStepTitle(
      "Connaissez-vous les types d'espaces présents sur l'exploitation ?",
    );
    await siteCreationPage.expectStepperCurrentStep("Espaces");
    await siteCreationPage.selectSpacesKnowledge("yes");

    // Sélection des types d'espaces
    await siteCreationPage.expectStepTitle("Quels types d'espaces y a-t-il sur l'exploitation ?");
    await siteCreationPage.expectStepperCurrentStep("Espaces");
    await siteCreationPage.selectSpaces([
      "CULTIVATION",
      "PRAIRIE_GRASS",
      "PRAIRIE_BUSHES",
      "BUILDINGS",
    ]);

    // Connaissance des superficies
    await siteCreationPage.expectStepTitle(
      "Connaissez-vous les superficies des différents espaces de l'exploitation ?",
    );
    await siteCreationPage.expectStepperCurrentStep("Espaces");
    await siteCreationPage.selectSpacesDistributionKnowledge("yes");

    // Distribution des superficies
    await siteCreationPage.expectStepTitle("Quelle superficie font les différents espaces ?");
    await siteCreationPage.expectStepperCurrentStep("Espaces");
    await siteCreationPage.fillSpacesDistribution({
      CULTIVATION: 20_000,
      PRAIRIE_GRASS: 2_500,
      PRAIRIE_BUSHES: 1_000,
      BUILDINGS: 1_500,
    });

    // Récapitulatif des sols
    await siteCreationPage.expectStepTitle("Récapitulatif de l'occupation des sols");
    await siteCreationPage.expectStepperCurrentStep("Espaces");
    await siteCreationPage.goToNextStep();

    // Stockage carbone
    await siteCreationPage.expectStepTitle("Stockage du carbone par les sols");
    await siteCreationPage.expectStepperCurrentStep("Espaces");
    await siteCreationPage.goToNextStep();

    // --- Gestion du site ---

    // Introduction gestion
    await siteCreationPage.expectStepTitle("Un ou plusieurs acteurs sont liés à l'exploitation");
    await siteCreationPage.expectStepperCurrentStep("Gestion du site");
    await siteCreationPage.goToNextStep();

    // Propriétaire : Mairie de Chartres
    await siteCreationPage.expectStepTitle("Qui est le propriétaire actuel de l'exploitation");
    await siteCreationPage.expectStepperCurrentStep("Gestion du site");
    await siteCreationPage.selectOwnerLocalAuthority("Mairie de Chartres");

    // L'exploitation est-elle encore en activité ?
    await siteCreationPage.expectStepTitle("L'exploitation agricole est-elle encore en activité ?");
    await siteCreationPage.expectStepperCurrentStep("Gestion du site");
    await siteCreationPage.selectIsSiteOperated("yes");

    // Exploitant : le propriétaire actuel
    await siteCreationPage.expectStepTitle("Qui est l'exploitant ?");
    await siteCreationPage.expectStepperCurrentStep("Gestion du site");
    await siteCreationPage.selectOperatorAsSiteOwner();

    // --- Dépenses et recettes ---

    // Introduction dépenses et recettes
    await siteCreationPage.expectStepTitle(
      "Cette exploitation agricole génère certainement des dépenses et des recettes.",
    );
    await siteCreationPage.expectStepperCurrentStep("Gestion du site");
    await siteCreationPage.goToNextStep();

    // Dépenses annuelles - laisser les valeurs pré-calculées
    await siteCreationPage.expectStepTitle("Dépenses annuelles liées à l'exploitation");
    await siteCreationPage.expectStepperCurrentStep("Gestion du site");
    await siteCreationPage.submitExpenses();

    // Recettes annuelles - laisser les valeurs pré-calculées
    await siteCreationPage.expectStepTitle("Recettes annuelles liées à l'exploitation");
    await siteCreationPage.expectStepperCurrentStep("Gestion du site");
    await siteCreationPage.submitIncome();

    // Récapitulatif dépenses et recettes
    await siteCreationPage.expectStepTitle(
      "Récapitulatif des dépenses et recettes liées à l'exploitation",
    );
    await siteCreationPage.expectStepperCurrentStep("Gestion du site");
    await siteCreationPage.goToNextStep();

    // --- Dénomination ---

    // Introduction dénomination
    await siteCreationPage.expectStepTitle("Quelle est l'identité de ce site ?");
    await siteCreationPage.expectStepperCurrentStep("Dénomination");
    await siteCreationPage.goToNextStep();

    // Nom et description
    await siteCreationPage.expectStepTitle("Dénomination du site");
    await siteCreationPage.expectStepperCurrentStep("Dénomination");
    await siteCreationPage.fillSiteNameAndDescription("Exploitation céréalière de Chartres");

    // --- Récapitulatif final ---
    await siteCreationPage.expectStepperCurrentStep("Récapitulatif");
    await siteCreationPage.expectFinalSummary();

    // Vérifier les données saisies dans le récapitulatif
    await siteCreationPage.expectCreationSuccessWithDataInList([
      ["Superficie totale du site", "25 000 ㎡"],
      ["Propriétaire actuel", "Mairie de Chartres"],
      ["Type d'exploitation", "Grandes cultures de céréales et oléagineux"],
      ["Nom du site", "Exploitation céréalière de Chartres"],
    ]);

    // Créer le site
    await siteCreationPage.createSite();

    // Vérifier le succès
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

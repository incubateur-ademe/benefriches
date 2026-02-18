import { test } from "./site-creation.fixtures";

test.describe("site creation (custom mode)", () => {
  test.setTimeout(60_000);

  test("allows authenticated user to create a friche site via custom mode", async ({
    siteCreationPage,
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
    await siteCreationPage.selectFricheActivity("INDUSTRY");

    // Adresse
    await siteCreationPage.fillAddress("Sendere Blajan");

    // --- Espaces et sols ---

    // Introduction espaces
    await siteCreationPage.goToNextStep();

    // Surface du site
    await siteCreationPage.fillSurfaceArea(10_000);

    // Connaissance des espaces
    await siteCreationPage.selectSpacesKnowledge("yes");

    // Sélection des types d'espaces
    await siteCreationPage.selectSpaces([
      "BUILDINGS",
      "IMPERMEABLE_SOILS",
      "MINERAL_SOIL",
      "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
    ]);

    // Connaissance des superficies
    await siteCreationPage.selectSpacesDistributionKnowledge("yes");

    // Distribution des superficies
    await siteCreationPage.fillSpacesDistribution({
      BUILDINGS: 3000,
      IMPERMEABLE_SOILS: 2000,
      MINERAL_SOIL: 3000,
      ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 2000,
    });

    // Récapitulatif des sols
    await siteCreationPage.goToNextStep();

    // Stockage carbone
    await siteCreationPage.goToNextStep();

    // --- Pollution ---

    // Introduction pollution
    await siteCreationPage.goToNextStep();

    // Pollution des sols (buildings 3000 + impermeable 2000 = 5000)
    await siteCreationPage.selectSoilsContamination("yes", 5000);

    // --- Accidents ---

    // Introduction accidents
    await siteCreationPage.goToNextStep();

    // Pas d'accidents
    await siteCreationPage.selectFricheAccidents("no");

    // --- Gestion du site ---

    // Introduction gestion
    await siteCreationPage.goToNextStep();

    // Propriétaire : Mairie de Blajan
    await siteCreationPage.selectOwnerLocalAuthority("Mairie de Blajan");

    // La friche n'est pas louée
    await siteCreationPage.selectIsFricheLeased("no");

    // --- Dépenses ---

    // Introduction dépenses
    await siteCreationPage.goToNextStep();

    // Dépenses annuelles - laisser les valeurs pré-calculées
    await siteCreationPage.submitExpenses();

    // Récapitulatif dépenses
    await siteCreationPage.goToNextStep();

    // --- Dénomination ---

    // Introduction dénomination
    await siteCreationPage.goToNextStep();

    // Nom et description
    await siteCreationPage.fillSiteNameAndDescription("Friche industrielle de Blajan");

    // --- Récapitulatif final ---
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
  });
});

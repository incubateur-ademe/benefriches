import { test } from "./fixtures";

const PROJECT_NAME = "Centrale photovoltaïque de Meylan";

test.describe("photovoltaic project creation - custom mode", () => {
  test("allows authenticated user to create a photovoltaic power station via custom mode", async ({
    pvProjectCreationPage,
    agriculturalSite,
  }) => {
    // Navigate to project creation
    await pvProjectCreationPage.goto(agriculturalSite.id);

    // --- Project phase ---
    await pvProjectCreationPage.expectStepTitle("A quelle phase du projet êtes-vous ?");
    await pvProjectCreationPage.selectProjectPhase("Montage / Développement");

    // Create mode selection
    await pvProjectCreationPage.expectStepTitle("Que savez vous de votre projet ?");
    await pvProjectCreationPage.selectCreateMode("custom");

    // Project type selection
    await pvProjectCreationPage.expectStepTitle("Quel type de projet souhaitez-vous évaluer ?");
    await pvProjectCreationPage.selectProjectType();

    // Renewable energy type selection
    await pvProjectCreationPage.expectStepTitle("Quel système d'EnR souhaitez-vous installer ?");
    await pvProjectCreationPage.selectRenewableEnergyType();

    // --- Photovoltaic parameters ---

    // Key parameter: power
    await pvProjectCreationPage.expectStepTitle(
      "Quel est le paramètre déterminant pour la centrale photovoltaïque ?",
    );
    await pvProjectCreationPage.selectKeyParameter("POWER");

    // Electrical power: 296 kWc
    await pvProjectCreationPage.expectStepTitle("Quelle sera la puissance de l'installation ?");
    await pvProjectCreationPage.fillPower(296);

    // Surface area: 2700 m² (within suitable surface to avoid non-suitable soils path)
    await pvProjectCreationPage.expectStepTitle(
      "Quelle superficie du site occuperont les panneaux photovoltaïques ?",
    );
    await pvProjectCreationPage.fillSurface(2700);

    // Expected annual production: 374 MWh
    await pvProjectCreationPage.expectStepTitle(
      "Quelle est la production annuelle attendue de l'installation ?",
    );
    await pvProjectCreationPage.fillExpectedAnnualProduction(374);

    // Contract duration: 20 years
    await pvProjectCreationPage.expectStepTitle(
      "Quelle sera la durée prévisionnelle du contrat de la revente d'énergie au distributeur ?",
    );
    await pvProjectCreationPage.fillContractDuration(20);

    // --- Soils transformation ---

    // Soils transformation introduction
    await pvProjectCreationPage.expectStepTitle(
      "Nous allons maintenant parler de ce que seront les sols du site.",
    );
    await pvProjectCreationPage.goToNextStep();

    // Soils transformation project selection: keep current soils
    await pvProjectCreationPage.expectStepTitle("Que souhaitez-vous faire des sols du site ?");
    await pvProjectCreationPage.selectSoilsTransformationProject("keepCurrentSoils");

    // Soils summary
    await pvProjectCreationPage.expectSoilsSummaryStep();
    await pvProjectCreationPage.goToNextStep();

    // Soils carbon storage
    await pvProjectCreationPage.expectSoilsCarbonStorageStep();
    await pvProjectCreationPage.goToNextStep();

    // --- Stakeholders ---

    // Stakeholders introduction
    await pvProjectCreationPage.expectStepTitle(
      "Différents acteurs vont prendre part à votre projet",
    );
    await pvProjectCreationPage.goToNextStep();

    // Developer: select user's own structure
    await pvProjectCreationPage.expectStepTitle("Qui sera l'aménageur du site ?");
    await pvProjectCreationPage.selectStakeholder(/Ma structure/);

    // Future operator: select user's own structure
    await pvProjectCreationPage.expectStepTitle(
      "Qui sera l'exploitant de la centrale photovoltaïque ?",
    );
    await pvProjectCreationPage.selectStakeholder(/Ma structure/);

    // Site purchase: no
    await pvProjectCreationPage.expectStepTitle("Le site sera-t-il racheté à Mairie de Meylan ?");
    await pvProjectCreationPage.selectSitePurchase(false);

    // --- Expenses ---

    // Expenses introduction
    await pvProjectCreationPage.expectStepTitle("Votre projet va engendrer des dépenses.");
    await pvProjectCreationPage.goToNextStep();

    // PV installation expenses: accept pre-filled defaults
    await pvProjectCreationPage.expectStepTitle(
      "Dépenses d'installation de la centrale photovoltaïque",
    );
    await pvProjectCreationPage.submitOrSkipStep();

    // Yearly projected expenses: accept pre-filled defaults
    await pvProjectCreationPage.expectStepTitle("Dépenses annuelles");
    await pvProjectCreationPage.submitOrSkipStep();

    // --- Revenue ---

    // Revenue introduction
    await pvProjectCreationPage.expectStepTitle("Votre projet peut aussi engendrer des recettes");
    await pvProjectCreationPage.goToNextStep();

    // Yearly projected revenue: accept pre-filled defaults
    await pvProjectCreationPage.expectStepTitle("Recettes annuelles");
    await pvProjectCreationPage.submitOrSkipStep();

    // Financial assistance: skip or accept defaults
    await pvProjectCreationPage.expectStepTitle("Aides financières");
    await pvProjectCreationPage.submitOrSkipStep();

    // --- Schedule ---

    // Start: September 2027 (18 months from March 2026)
    // End: March 2029 (3 years from March 2026)
    // First year of operation: 2029
    await pvProjectCreationPage.expectStepTitle("Calendrier");
    await pvProjectCreationPage.fillSchedule("09/2027", "03/2029", 2029);

    // --- Name and description ---

    await pvProjectCreationPage.expectStepTitle("Dénomination du projet");
    await pvProjectCreationPage.fillNameAndDescription(PROJECT_NAME);

    // --- Final summary ---

    await pvProjectCreationPage.expectFinalSummary();
    await pvProjectCreationPage.submitFinalSummary();

    // --- Creation result ---

    await pvProjectCreationPage.expectCreationSuccess(PROJECT_NAME);
  });
});

test.describe("photovoltaic project creation - friche site", () => {
  const FRICHE_PROJECT_NAME = "Centrale photovoltaïque sur friche de Meylan";

  test("allows authenticated user to create a PV project on a friche site", async ({
    pvProjectCreationPage,
    fricheSite,
  }) => {
    // Navigate to project creation
    await pvProjectCreationPage.goto(fricheSite.id);

    // --- Project phase ---
    await pvProjectCreationPage.expectStepTitle("A quelle phase du projet êtes-vous ?");
    await pvProjectCreationPage.selectProjectPhase("Montage / Développement");

    // Create mode selection
    await pvProjectCreationPage.expectStepTitle("Que savez vous de votre projet ?");
    await pvProjectCreationPage.selectCreateMode("custom");

    // Project type selection
    await pvProjectCreationPage.expectStepTitle("Quel type de projet souhaitez-vous évaluer ?");
    await pvProjectCreationPage.selectProjectType();

    // Renewable energy type selection
    await pvProjectCreationPage.expectStepTitle("Quel système d'EnR souhaitez-vous installer ?");
    await pvProjectCreationPage.selectRenewableEnergyType();

    // --- Photovoltaic parameters ---

    await pvProjectCreationPage.expectStepTitle(
      "Quel est le paramètre déterminant pour la centrale photovoltaïque ?",
    );
    await pvProjectCreationPage.selectKeyParameter("POWER");

    await pvProjectCreationPage.expectStepTitle("Quelle sera la puissance de l'installation ?");
    await pvProjectCreationPage.fillPower(296);

    await pvProjectCreationPage.expectStepTitle(
      "Quelle superficie du site occuperont les panneaux photovoltaïques ?",
    );
    await pvProjectCreationPage.fillSurface(2700);

    await pvProjectCreationPage.expectStepTitle(
      "Quelle est la production annuelle attendue de l'installation ?",
    );
    await pvProjectCreationPage.fillExpectedAnnualProduction(374);

    await pvProjectCreationPage.expectStepTitle(
      "Quelle sera la durée prévisionnelle du contrat de la revente d'énergie au distributeur ?",
    );
    await pvProjectCreationPage.fillContractDuration(20);

    // --- Soils decontamination ---

    // Involves reinstatement: no
    await pvProjectCreationPage.expectStepTitle(
      "Le projet prévoit-il une remise en état du site ?",
    );
    await pvProjectCreationPage.selectInvolvesReinstatement(false);

    // Decontamination introduction
    await pvProjectCreationPage.expectStepTitle("Et si on dépolluait les sols ?");
    await pvProjectCreationPage.goToNextStep();

    // Decontamination selection: no decontamination
    await pvProjectCreationPage.expectStepTitle("Est-il est nécessaire de dépolluer les sols ?");
    await pvProjectCreationPage.selectDecontaminationOption("none");

    // --- Soils transformation ---

    // Soils transformation introduction
    await pvProjectCreationPage.expectStepTitle(
      "Nous allons maintenant parler de ce que seront les sols du site.",
    );
    await pvProjectCreationPage.goToNextStep();

    // Soils transformation project selection: keep current soils
    await pvProjectCreationPage.expectStepTitle("Que souhaitez-vous faire des sols du site ?");
    await pvProjectCreationPage.selectSoilsTransformationProject("keepCurrentSoils");

    // Soils summary
    await pvProjectCreationPage.expectSoilsSummaryStep();
    await pvProjectCreationPage.goToNextStep();

    // Soils carbon storage
    await pvProjectCreationPage.expectSoilsCarbonStorageStep();
    await pvProjectCreationPage.goToNextStep();

    // --- Stakeholders ---

    // Stakeholders introduction
    await pvProjectCreationPage.expectStepTitle(
      "Différents acteurs vont prendre part à votre projet",
    );
    await pvProjectCreationPage.goToNextStep();

    // Developer: select user's own structure
    await pvProjectCreationPage.expectStepTitle("Qui sera l'aménageur du site ?");
    await pvProjectCreationPage.selectStakeholder(/Ma structure/);

    // Future operator: select user's own structure
    await pvProjectCreationPage.expectStepTitle(
      "Qui sera l'exploitant de la centrale photovoltaïque ?",
    );
    await pvProjectCreationPage.selectStakeholder(/Ma structure/);

    // Site purchase: no
    await pvProjectCreationPage.expectStepTitle("Le site sera-t-il racheté à Mairie de Meylan ?");
    await pvProjectCreationPage.selectSitePurchase(false);

    // --- Expenses ---

    // Expenses introduction
    await pvProjectCreationPage.expectStepTitle("Votre projet va engendrer des dépenses.");
    await pvProjectCreationPage.goToNextStep();

    // PV installation expenses: accept pre-filled defaults
    await pvProjectCreationPage.expectStepTitle(
      "Dépenses d'installation de la centrale photovoltaïque",
    );
    await pvProjectCreationPage.submitOrSkipStep();

    // Yearly projected expenses: accept pre-filled defaults
    await pvProjectCreationPage.expectStepTitle("Dépenses annuelles");
    await pvProjectCreationPage.submitOrSkipStep();

    // --- Revenue ---

    // Revenue introduction
    await pvProjectCreationPage.expectStepTitle("Votre projet peut aussi engendrer des recettes");
    await pvProjectCreationPage.goToNextStep();

    // Yearly projected revenue: accept pre-filled defaults
    await pvProjectCreationPage.expectStepTitle("Recettes annuelles");
    await pvProjectCreationPage.submitOrSkipStep();

    // Financial assistance: skip or accept defaults
    await pvProjectCreationPage.expectStepTitle("Aides financières");
    await pvProjectCreationPage.submitOrSkipStep();

    // --- Schedule ---

    await pvProjectCreationPage.expectStepTitle("Calendrier");
    await pvProjectCreationPage.fillSchedule("09/2027", "03/2029", 2029);

    // --- Name and description ---

    await pvProjectCreationPage.expectStepTitle("Dénomination du projet");
    await pvProjectCreationPage.fillNameAndDescription(FRICHE_PROJECT_NAME);

    // --- Final summary ---

    await pvProjectCreationPage.expectFinalSummary();
    await pvProjectCreationPage.submitFinalSummary();

    // --- Creation result ---

    await pvProjectCreationPage.expectCreationSuccess(FRICHE_PROJECT_NAME);
  });
});

test.describe("photovoltaic project creation - custom mode driven by surface", () => {
  const SURFACE_PROJECT_NAME = "Centrale photovoltaïque par superficie de Meylan";

  test("allows authenticated user to create a photovoltaic power station keyed on surface", async ({
    pvProjectCreationPage,
    agriculturalSite,
  }) => {
    // Navigate to project creation
    await pvProjectCreationPage.goto(agriculturalSite.id);

    // --- Project phase ---
    await pvProjectCreationPage.expectStepTitle("A quelle phase du projet êtes-vous ?");
    await pvProjectCreationPage.selectProjectPhase("Montage / Développement");

    // Create mode selection
    await pvProjectCreationPage.expectStepTitle("Que savez vous de votre projet ?");
    await pvProjectCreationPage.selectCreateMode("custom");

    // Project type selection
    await pvProjectCreationPage.expectStepTitle("Quel type de projet souhaitez-vous évaluer ?");
    await pvProjectCreationPage.selectProjectType();

    // Renewable energy type selection
    await pvProjectCreationPage.expectStepTitle("Quel système d'EnR souhaitez-vous installer ?");
    await pvProjectCreationPage.selectRenewableEnergyType();

    // --- Photovoltaic parameters (surface-driven order: surface → power) ---

    // Key parameter: surface
    await pvProjectCreationPage.expectStepTitle(
      "Quel est le paramètre déterminant pour la centrale photovoltaïque ?",
    );
    await pvProjectCreationPage.selectKeyParameter("SURFACE");

    // Surface area: 2700 m² (within suitable surface to avoid non-suitable soils path)
    await pvProjectCreationPage.expectStepTitle(
      "Quelle superficie du site occuperont les panneaux photovoltaïques ?",
    );
    await pvProjectCreationPage.fillSurface(2700);

    // Electrical power: 296 kWc
    await pvProjectCreationPage.expectStepTitle("Quelle sera la puissance de l'installation ?");
    await pvProjectCreationPage.fillPower(296);

    // Expected annual production: 374 MWh
    await pvProjectCreationPage.expectStepTitle(
      "Quelle est la production annuelle attendue de l'installation ?",
    );
    await pvProjectCreationPage.fillExpectedAnnualProduction(374);

    // Contract duration: 20 years
    await pvProjectCreationPage.expectStepTitle(
      "Quelle sera la durée prévisionnelle du contrat de la revente d'énergie au distributeur ?",
    );
    await pvProjectCreationPage.fillContractDuration(20);

    // --- Soils transformation ---

    // Soils transformation introduction
    await pvProjectCreationPage.expectStepTitle(
      "Nous allons maintenant parler de ce que seront les sols du site.",
    );
    await pvProjectCreationPage.goToNextStep();

    // Soils transformation project selection: keep current soils
    await pvProjectCreationPage.expectStepTitle("Que souhaitez-vous faire des sols du site ?");
    await pvProjectCreationPage.selectSoilsTransformationProject("keepCurrentSoils");

    // Soils summary
    await pvProjectCreationPage.expectSoilsSummaryStep();
    await pvProjectCreationPage.goToNextStep();

    // Soils carbon storage
    await pvProjectCreationPage.expectSoilsCarbonStorageStep();
    await pvProjectCreationPage.goToNextStep();

    // --- Stakeholders ---

    // Stakeholders introduction
    await pvProjectCreationPage.expectStepTitle(
      "Différents acteurs vont prendre part à votre projet",
    );
    await pvProjectCreationPage.goToNextStep();

    // Developer: select user's own structure
    await pvProjectCreationPage.expectStepTitle("Qui sera l'aménageur du site ?");
    await pvProjectCreationPage.selectStakeholder(/Ma structure/);

    // Future operator: select user's own structure
    await pvProjectCreationPage.expectStepTitle(
      "Qui sera l'exploitant de la centrale photovoltaïque ?",
    );
    await pvProjectCreationPage.selectStakeholder(/Ma structure/);

    // Site purchase: no
    await pvProjectCreationPage.expectStepTitle("Le site sera-t-il racheté à Mairie de Meylan ?");
    await pvProjectCreationPage.selectSitePurchase(false);

    // --- Expenses ---

    // Expenses introduction
    await pvProjectCreationPage.expectStepTitle("Votre projet va engendrer des dépenses.");
    await pvProjectCreationPage.goToNextStep();

    // PV installation expenses: accept pre-filled defaults
    await pvProjectCreationPage.expectStepTitle(
      "Dépenses d'installation de la centrale photovoltaïque",
    );
    await pvProjectCreationPage.submitOrSkipStep();

    // Yearly projected expenses: accept pre-filled defaults
    await pvProjectCreationPage.expectStepTitle("Dépenses annuelles");
    await pvProjectCreationPage.submitOrSkipStep();

    // --- Revenue ---

    // Revenue introduction
    await pvProjectCreationPage.expectStepTitle("Votre projet peut aussi engendrer des recettes");
    await pvProjectCreationPage.goToNextStep();

    // Yearly projected revenue: accept pre-filled defaults
    await pvProjectCreationPage.expectStepTitle("Recettes annuelles");
    await pvProjectCreationPage.submitOrSkipStep();

    // Financial assistance: skip or accept defaults
    await pvProjectCreationPage.expectStepTitle("Aides financières");
    await pvProjectCreationPage.submitOrSkipStep();

    // --- Schedule ---

    await pvProjectCreationPage.expectStepTitle("Calendrier");
    await pvProjectCreationPage.fillSchedule("09/2027", "03/2029", 2029);

    // --- Name and description ---

    await pvProjectCreationPage.expectStepTitle("Dénomination du projet");
    await pvProjectCreationPage.fillNameAndDescription(SURFACE_PROJECT_NAME);

    // --- Final summary ---

    await pvProjectCreationPage.expectFinalSummary();
    await pvProjectCreationPage.submitFinalSummary();

    // --- Creation result ---

    await pvProjectCreationPage.expectCreationSuccess(SURFACE_PROJECT_NAME);
  });
});

test.describe("photovoltaic project creation - demo mode", () => {
  test("allows authenticated user to create a photovoltaic power station via express mode", async ({
    pvProjectCreationPage,
    agriculturalSite,
  }) => {
    // Navigate to project creation with the test site
    await pvProjectCreationPage.goto(agriculturalSite.id);

    // --- Project phase ---
    await pvProjectCreationPage.expectStepTitle("A quelle phase du projet êtes-vous ?");
    await pvProjectCreationPage.selectProjectPhase("Montage / Développement");

    // Create mode selection step
    await pvProjectCreationPage.expectStepTitle("Que savez vous de votre projet ?");
    await pvProjectCreationPage.selectCreateMode("express");

    // Urban project template selection step
    await pvProjectCreationPage.selectProjectTemplate();

    // Summary step

    await pvProjectCreationPage.expectFinalSummary();
    await pvProjectCreationPage.submitFinalSummary();

    // Creation result
    await pvProjectCreationPage.expectCreationSuccess("Centrale photovoltaïque");

    // View important info (onboarding)
    await pvProjectCreationPage.clickViewImportantInfo();
    await pvProjectCreationPage.expectOnboardingStep1();
  });
});

test.describe("photovoltaic project creation - programmation phase custom mode", () => {
  const PROGRAMMATION_PROJECT_NAME = "Centrale photovoltaïque en programmation de Meylan";

  test("allows authenticated user to create a photovoltaic power station in programmation phase", async ({
    pvProjectCreationPage,
    agriculturalSite,
  }) => {
    // Navigate to project creation with the test site
    await pvProjectCreationPage.goto(agriculturalSite.id);

    // --- Project phase ---
    // "Programmation" phase goes straight to project type (no create-mode selection).
    await pvProjectCreationPage.expectStepTitle("A quelle phase du projet êtes-vous ?");
    await pvProjectCreationPage.selectProjectPhase("Programmation");

    // Project type selection
    await pvProjectCreationPage.expectStepTitle("Quel type de projet souhaitez-vous évaluer ?");
    await pvProjectCreationPage.selectProjectType();

    // Renewable energy type selection
    await pvProjectCreationPage.expectStepTitle("Quel système d'EnR souhaitez-vous installer ?");
    await pvProjectCreationPage.selectRenewableEnergyType();

    // --- Photovoltaic parameters ---

    // Key parameter: power
    await pvProjectCreationPage.expectStepTitle(
      "Quel est le paramètre déterminant pour la centrale photovoltaïque ?",
    );
    await pvProjectCreationPage.selectKeyParameter("POWER");

    await pvProjectCreationPage.expectStepTitle("Quelle sera la puissance de l'installation ?");
    await pvProjectCreationPage.fillPower(296);

    await pvProjectCreationPage.expectStepTitle(
      "Quelle superficie du site occuperont les panneaux photovoltaïques ?",
    );
    await pvProjectCreationPage.fillSurface(2700);

    await pvProjectCreationPage.expectStepTitle(
      "Quelle est la production annuelle attendue de l'installation ?",
    );
    await pvProjectCreationPage.fillExpectedAnnualProduction(374);

    await pvProjectCreationPage.expectStepTitle(
      "Quelle sera la durée prévisionnelle du contrat de la revente d'énergie au distributeur ?",
    );
    await pvProjectCreationPage.fillContractDuration(20);

    // --- Soils transformation ---

    // Soils transformation introduction
    await pvProjectCreationPage.expectStepTitle(
      "Nous allons maintenant parler de ce que seront les sols du site.",
    );
    await pvProjectCreationPage.goToNextStep();

    // Soils transformation project selection: keep current soils
    await pvProjectCreationPage.expectStepTitle("Que souhaitez-vous faire des sols du site ?");
    await pvProjectCreationPage.selectSoilsTransformationProject("keepCurrentSoils");

    // Soils summary
    await pvProjectCreationPage.expectSoilsSummaryStep();
    await pvProjectCreationPage.goToNextStep();

    // Soils carbon storage
    await pvProjectCreationPage.expectSoilsCarbonStorageStep();
    await pvProjectCreationPage.goToNextStep();

    // --- Stakeholders ---

    // Stakeholders introduction
    await pvProjectCreationPage.expectStepTitle(
      "Différents acteurs vont prendre part à votre projet",
    );
    await pvProjectCreationPage.goToNextStep();

    // Developer: select user's own structure
    await pvProjectCreationPage.expectStepTitle("Qui sera l'aménageur du site ?");
    await pvProjectCreationPage.selectStakeholder(/Ma structure/);

    // Future operator: select user's own structure
    await pvProjectCreationPage.expectStepTitle(
      "Qui sera l'exploitant de la centrale photovoltaïque ?",
    );
    await pvProjectCreationPage.selectStakeholder(/Ma structure/);

    // Site purchase: no
    await pvProjectCreationPage.expectStepTitle("Le site sera-t-il racheté à Mairie de Meylan ?");
    await pvProjectCreationPage.selectSitePurchase(false);

    // --- Expenses ---

    // Expenses introduction
    await pvProjectCreationPage.expectStepTitle("Votre projet va engendrer des dépenses.");
    await pvProjectCreationPage.goToNextStep();

    // PV installation expenses: accept pre-filled defaults
    await pvProjectCreationPage.expectStepTitle(
      "Dépenses d'installation de la centrale photovoltaïque",
    );
    await pvProjectCreationPage.submitOrSkipStep();

    // Yearly projected expenses: accept pre-filled defaults
    await pvProjectCreationPage.expectStepTitle("Dépenses annuelles");
    await pvProjectCreationPage.submitOrSkipStep();

    // --- Revenue ---

    // Revenue introduction
    await pvProjectCreationPage.expectStepTitle("Votre projet peut aussi engendrer des recettes");
    await pvProjectCreationPage.goToNextStep();

    // Yearly projected revenue: accept pre-filled defaults
    await pvProjectCreationPage.expectStepTitle("Recettes annuelles");
    await pvProjectCreationPage.submitOrSkipStep();

    // Financial assistance: skip or accept defaults
    await pvProjectCreationPage.expectStepTitle("Aides financières");
    await pvProjectCreationPage.submitOrSkipStep();

    // --- Schedule ---

    await pvProjectCreationPage.expectStepTitle("Calendrier");
    await pvProjectCreationPage.fillSchedule("09/2027", "03/2029", 2029);

    // --- Name and description ---

    await pvProjectCreationPage.expectStepTitle("Dénomination du projet");
    await pvProjectCreationPage.fillNameAndDescription(PROGRAMMATION_PROJECT_NAME);

    // --- Final summary ---

    await pvProjectCreationPage.expectFinalSummary();
    await pvProjectCreationPage.submitFinalSummary();

    // --- Creation result ---

    await pvProjectCreationPage.expectCreationSuccess(PROGRAMMATION_PROJECT_NAME);
  });
});

test.describe("photovoltaic project creation - non-suitable soils custom transformation", () => {
  const NON_SUITABLE_SOILS_PROJECT_NAME = "Centrale photovoltaïque sur sols non adaptés de Meylan";

  test("allows authenticated user to create a photovoltaic power station requiring soils transformation", async ({
    pvProjectCreationPage,
    agriculturalSite,
  }) => {
    // Navigate to project creation
    await pvProjectCreationPage.goto(agriculturalSite.id);

    // --- Project phase ---
    await pvProjectCreationPage.expectStepTitle("A quelle phase du projet êtes-vous ?");
    await pvProjectCreationPage.selectProjectPhase("Montage / Développement");

    // Create mode selection
    await pvProjectCreationPage.expectStepTitle("Que savez vous de votre projet ?");
    await pvProjectCreationPage.selectCreateMode("custom");

    // Project type selection
    await pvProjectCreationPage.expectStepTitle("Quel type de projet souhaitez-vous évaluer ?");
    await pvProjectCreationPage.selectProjectType();

    // Renewable energy type selection
    await pvProjectCreationPage.expectStepTitle("Quel système d'EnR souhaitez-vous installer ?");
    await pvProjectCreationPage.selectRenewableEnergyType();

    // --- Photovoltaic parameters ---

    // Key parameter: power
    await pvProjectCreationPage.expectStepTitle(
      "Quel est le paramètre déterminant pour la centrale photovoltaïque ?",
    );
    await pvProjectCreationPage.selectKeyParameter("POWER");

    // Electrical power: 440 kWc
    await pvProjectCreationPage.expectStepTitle("Quelle sera la puissance de l'installation ?");
    await pvProjectCreationPage.fillPower(440);

    // Surface area: 4000 m² (exceeds the site's suitable surface of 2760 m², triggers the
    // non-suitable soils path)
    await pvProjectCreationPage.expectStepTitle(
      "Quelle superficie du site occuperont les panneaux photovoltaïques ?",
    );
    await pvProjectCreationPage.fillSurface(4000);

    // Expected annual production: 550 MWh
    await pvProjectCreationPage.expectStepTitle(
      "Quelle est la production annuelle attendue de l'installation ?",
    );
    await pvProjectCreationPage.fillExpectedAnnualProduction(550);

    // Contract duration: 20 years
    await pvProjectCreationPage.expectStepTitle(
      "Quelle sera la durée prévisionnelle du contrat de la revente d'énergie au distributeur ?",
    );
    await pvProjectCreationPage.fillContractDuration(20);

    // --- Non-suitable soils transformation ---

    // Soils transformation introduction
    await pvProjectCreationPage.expectStepTitle(
      "Nous allons maintenant parler de ce que seront les sols du site.",
    );
    await pvProjectCreationPage.goToNextStep();

    // Non-suitable soils notice
    await pvProjectCreationPage.expectStepTitle(
      "Le site n'est pas encore prêt à accueillir une centrale photovoltaïque.",
    );
    await pvProjectCreationPage.goToNextStep();

    // Non-suitable soils selection: remove all buildings (1380 m², already covers the
    // 1240 m² missing suitable surface on its own)
    await pvProjectCreationPage.expectStepTitle("Quels espaces souhaitez-vous supprimer ?");
    await pvProjectCreationPage.selectNonSuitableSoilsToTransform(["BUILDINGS"]);

    // Non-suitable soils surface to transform: flatten all 1380 m² of buildings
    await pvProjectCreationPage.expectStepTitle(
      "Quelle proportion de chaque espace souhaitez-vous supprimer ?",
    );
    await pvProjectCreationPage.fillNonSuitableSoilsSurfaceToTransform({ BUILDINGS: 1380 });

    // --- Soils transformation project selection ---

    // Custom transformation: manually allocate the new soils
    await pvProjectCreationPage.expectStepTitle("Que souhaitez-vous faire des sols du site ?");
    await pvProjectCreationPage.selectSoilsTransformationProject("custom");

    // Future soils selection: keep mineral soil and impermeable soils (required for panels),
    // add artificial grass and wooded soil
    await pvProjectCreationPage.expectStepTitle("Quels types de sols y aura-t-il sur ce site ?");
    await pvProjectCreationPage.selectFutureSoils([
      "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
      "ARTIFICIAL_TREE_FILLED",
    ]);

    // Future soils surface area allocation: sums to the site's total surface of 4600 m²
    await pvProjectCreationPage.expectStepTitle("Quelles seront les superficies des sols ?");
    await pvProjectCreationPage.fillFutureSoilsSurfaceArea({
      IMPERMEABLE_SOILS: 100,
      MINERAL_SOIL: 100,
      ARTIFICIAL_TREE_FILLED: 1400,
      ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 3000,
    });

    // Soils summary
    await pvProjectCreationPage.expectSoilsSummaryStep();
    await pvProjectCreationPage.goToNextStep();

    // Soils carbon storage
    // Note: kept as the loose existing assertion (not expectStepTitle) — the e2e stack's
    // cities/carbon_storage reference tables aren't seeded, so this step renders an error
    // state for every PV test, not just this one; see other PV specs in this file.
    await pvProjectCreationPage.expectSoilsCarbonStorageStep();
    await pvProjectCreationPage.goToNextStep();

    // --- Stakeholders ---

    // Stakeholders introduction
    await pvProjectCreationPage.expectStepTitle(
      "Différents acteurs vont prendre part à votre projet",
    );
    await pvProjectCreationPage.goToNextStep();

    // Developer: select user's own structure
    await pvProjectCreationPage.expectStepTitle("Qui sera l'aménageur du site ?");
    await pvProjectCreationPage.selectStakeholder(/Ma structure/);

    // Future operator: select user's own structure
    await pvProjectCreationPage.expectStepTitle(
      "Qui sera l'exploitant de la centrale photovoltaïque ?",
    );
    await pvProjectCreationPage.selectStakeholder(/Ma structure/);

    // Site purchase: no (current user isn't the site owner, "Mairie de Meylan")
    await pvProjectCreationPage.expectStepTitle("Le site sera-t-il racheté à Mairie de Meylan ?");
    await pvProjectCreationPage.selectSitePurchase(false);

    // --- Expenses ---

    // Expenses introduction
    await pvProjectCreationPage.expectStepTitle("Votre projet va engendrer des dépenses.");
    await pvProjectCreationPage.goToNextStep();

    // PV installation expenses: accept pre-filled defaults
    await pvProjectCreationPage.expectStepTitle(
      "Dépenses d'installation de la centrale photovoltaïque",
    );
    await pvProjectCreationPage.submitOrSkipStep();

    // Yearly projected expenses: accept pre-filled defaults
    await pvProjectCreationPage.expectStepTitle("Dépenses annuelles");
    await pvProjectCreationPage.submitOrSkipStep();

    // --- Revenue ---

    // Revenue introduction
    await pvProjectCreationPage.expectStepTitle("Votre projet peut aussi engendrer des recettes");
    await pvProjectCreationPage.goToNextStep();

    // Yearly projected revenue: accept pre-filled defaults
    await pvProjectCreationPage.expectStepTitle("Recettes annuelles");
    await pvProjectCreationPage.submitOrSkipStep();

    // Financial assistance: skip or accept defaults
    await pvProjectCreationPage.expectStepTitle("Aides financières");
    await pvProjectCreationPage.submitOrSkipStep();

    // --- Schedule ---

    await pvProjectCreationPage.expectStepTitle("Calendrier");
    await pvProjectCreationPage.fillSchedule("09/2027", "03/2029", 2029);

    // --- Name and description ---

    await pvProjectCreationPage.expectStepTitle("Dénomination du projet");
    await pvProjectCreationPage.fillNameAndDescription(NON_SUITABLE_SOILS_PROJECT_NAME);

    // --- Final summary ---

    await pvProjectCreationPage.expectFinalSummary();
    await pvProjectCreationPage.submitFinalSummary();

    // --- Creation result ---

    await pvProjectCreationPage.expectCreationSuccess(NON_SUITABLE_SOILS_PROJECT_NAME);
  });
});

import { test } from "../fixtures";

test.describe("site creation - friche - custom mode", () => {
  test("allows authenticated user to create a friche site via custom mode", async ({
    myEvaluationsPage,
    siteCreationPage,
    siteFeaturesPage,
  }) => {
    await siteCreationPage.goto();

    await siteCreationPage.selectCreateMode("custom");

    await siteCreationPage.expectIntroductionStep();
    await siteCreationPage.clickStart();

    await siteCreationPage.selectIsFriche("yes");
    await siteCreationPage.selectWhatToEvaluate("impacts");

    await siteCreationPage.expectStepTitle("De quel type de friche s'agit-il ?");
    await siteCreationPage.expectStepperCurrentStep("Introduction");
    await siteCreationPage.selectFricheActivity("INDUSTRY");

    await siteCreationPage.expectStepTitle("Où est située la friche ?");
    await siteCreationPage.expectStepperCurrentStep("Adresse");
    await siteCreationPage.fillAddress("Sendere Blajan");

    await siteCreationPage.expectStepTitle(
      "Parlons d'abord des espaces qui existent actuellement sur la friche.",
    );
    await siteCreationPage.expectStepperCurrentStep("Espaces");
    await siteCreationPage.goToNextStep();

    await siteCreationPage.expectStepTitle("Quelle est la superficie totale de la friche ?");
    await siteCreationPage.expectStepperCurrentStep("Espaces");
    await siteCreationPage.fillSurfaceArea(10_000);

    await siteCreationPage.expectStepTitle(
      "Connaissez-vous les types d'espaces présents sur la friche ?",
    );
    await siteCreationPage.expectStepperCurrentStep("Espaces");
    await siteCreationPage.selectSpacesKnowledge("yes");

    await siteCreationPage.expectStepTitle("Quels types d'espaces y a-t-il sur la friche ?");
    await siteCreationPage.expectStepperCurrentStep("Espaces");
    await siteCreationPage.selectSpaces([
      "BUILDINGS",
      "IMPERMEABLE_SOILS",
      "MINERAL_SOIL",
      "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
    ]);

    await siteCreationPage.expectStepTitle(
      "Connaissez-vous les superficies des différents espaces de la friche ?",
    );
    await siteCreationPage.expectStepperCurrentStep("Espaces");
    await siteCreationPage.selectSpacesDistributionKnowledge("yes");

    await siteCreationPage.expectStepTitle("Quelle superficie font les différents espaces ?");
    await siteCreationPage.expectStepperCurrentStep("Espaces");
    await siteCreationPage.fillSpacesDistribution({
      BUILDINGS: 3000,
      IMPERMEABLE_SOILS: 2000,
      MINERAL_SOIL: 3000,
      ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 2000,
    });

    await siteCreationPage.expectStepTitle("Récapitulatif de l'occupation des sols");
    await siteCreationPage.expectStepperCurrentStep("Espaces");
    await siteCreationPage.goToNextStep();

    await siteCreationPage.expectStepTitle("Stockage du carbone par les sols");
    await siteCreationPage.expectStepperCurrentStep("Espaces");
    await siteCreationPage.goToNextStep();

    await siteCreationPage.expectStepTitle("La friche est peut-être polluée.");
    await siteCreationPage.expectStepperCurrentStep("Pollution et accidents");
    await siteCreationPage.goToNextStep();

    await siteCreationPage.expectStepTitle("Les sols de la friche sont-ils pollués ?");
    await siteCreationPage.expectStepperCurrentStep("Pollution et accidents");
    await siteCreationPage.selectSoilsContamination("yes", 5000);

    await siteCreationPage.expectStepTitle("Des accidents peuvent survenir sur la friche");
    await siteCreationPage.expectStepperCurrentStep("Pollution et accidents");
    await siteCreationPage.goToNextStep();

    await siteCreationPage.expectStepTitle(
      "Y a-t-il eu des accidents sur la friche ces 5 dernières années ?",
    );
    await siteCreationPage.expectStepperCurrentStep("Pollution et accidents");
    await siteCreationPage.selectFricheAccidents("no");

    await siteCreationPage.expectStepTitle("Un ou plusieurs acteurs sont liés à la friche");
    await siteCreationPage.expectStepperCurrentStep("Gestion du site");
    await siteCreationPage.goToNextStep();

    await siteCreationPage.expectStepTitle("Qui est le propriétaire actuel de la friche");
    await siteCreationPage.expectStepperCurrentStep("Gestion du site");
    await siteCreationPage.selectOwnerLocalAuthority("Mairie de Blajan");

    await siteCreationPage.expectStepTitle("La friche est-elle encore louée ?");
    await siteCreationPage.expectStepperCurrentStep("Gestion du site");
    await siteCreationPage.selectIsFricheLeased("no");

    await siteCreationPage.expectStepTitle("La friche engendre des dépenses");
    await siteCreationPage.expectStepperCurrentStep("Gestion du site");
    await siteCreationPage.goToNextStep();

    await siteCreationPage.expectStepTitle("Dépenses annuelles liées à la friche");
    await siteCreationPage.expectStepperCurrentStep("Gestion du site");
    await siteCreationPage.submitExpenses();

    await siteCreationPage.expectStepTitle(
      "Récapitulatif des dépenses annuelles liées à la friche",
    );
    await siteCreationPage.expectStepperCurrentStep("Gestion du site");
    await siteCreationPage.goToNextStep();

    await siteCreationPage.expectStepTitle("Quelle est l'identité de ce site ?");
    await siteCreationPage.expectStepperCurrentStep("Dénomination");
    await siteCreationPage.goToNextStep();

    await siteCreationPage.expectStepTitle("Dénomination du site");
    await siteCreationPage.expectStepperCurrentStep("Dénomination");
    await siteCreationPage.fillSiteNameAndDescription("Friche industrielle de Blajan");

    await siteCreationPage.expectStepperCurrentStep("Récapitulatif");
    await siteCreationPage.expectFinalSummary();

    await siteCreationPage.expectCreationSuccessWithDataInList([
      ["Superficie totale du site", "10 000 ㎡"],
      ["Superficie polluée", "5 000 ㎡"],
      ["Propriétaire actuel", "Mairie de Blajan"],
      ["Type de friche", "Friche industrielle"],
      ["Nom du site", "Friche industrielle de Blajan"],
    ]);

    await siteCreationPage.createSite();

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
});

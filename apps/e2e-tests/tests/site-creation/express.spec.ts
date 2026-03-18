import { test } from "./site-creation.fixtures";

test.describe("site creation (express mode)", () => {
  test("allows authenticated user to create a friche site via express mode", async ({
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
    await siteCreationPage.selectCreateMode("express");

    // Type de friche
    await siteCreationPage.expectStepTitle("De quel type de friche s'agit-il ?");
    await siteCreationPage.expectStepperCurrentStep("Introduction");
    await siteCreationPage.selectFricheActivity("INDUSTRY");

    // Adresse
    await siteCreationPage.expectStepTitle("Où est située la friche ?");
    await siteCreationPage.expectStepperCurrentStep("Adresse");
    await siteCreationPage.fillAddress("Blajan");

    // Surface du site
    await siteCreationPage.expectStepTitle("Quelle est la superficie totale de la friche ?");
    await siteCreationPage.expectStepperCurrentStep("Superficie");
    await siteCreationPage.fillSurfaceArea(10000);

    // Succès
    await siteCreationPage.expectCreationSuccessWithDataInList([
      ["Type de friche", "Friche industrielle"],
      ["Superficie totale du site", "10 000 ㎡"],
      ["Adresse", "Blajan"],
    ]);

    await siteCreationPage.expectExpressCreationDisclaimer();
    await siteCreationPage.hideExpressCreationDisclaimer();
    await siteCreationPage.expectCreateProjectLink();
  });

  test("allows authenticated user to create an agricultural site via express mode", async ({
    siteCreationPage,
  }) => {
    // Navigate to site creation page
    await siteCreationPage.goto();

    // Introduction
    await siteCreationPage.expectIntroductionStep();
    await siteCreationPage.clickStart();

    // Friche ?
    await siteCreationPage.selectIsFriche("no");

    // Nature du site
    await siteCreationPage.selectSiteNature("AGRICULTURAL_OPERATION");

    // Mode de création
    await siteCreationPage.selectCreateMode("express");

    // Type d'exploitation agricole
    await siteCreationPage.expectStepTitle("De quel type d'exploitation agricole s'agit-il");
    await siteCreationPage.expectStepperCurrentStep("Introduction");
    await siteCreationPage.selectAgriculturalActivity("POLYCULTURE_AND_LIVESTOCK");

    // Adresse
    await siteCreationPage.expectStepTitle("Où est située l'exploitation agricole ?");
    await siteCreationPage.expectStepperCurrentStep("Adresse");
    await siteCreationPage.fillAddress("Lyon");

    // Surface du site
    await siteCreationPage.expectStepTitle("Quelle est la superficie totale de l'exploitation ?");
    await siteCreationPage.expectStepperCurrentStep("Superficie");
    await siteCreationPage.fillSurfaceArea(50000);

    // Succès
    await siteCreationPage.expectCreationSuccessWithDataInList([
      ["Type d'exploitation", "Polyculture / polyélevage"],
      ["Superficie totale du site", "50 000 ㎡"],
      ["Adresse", "Lyon"],
    ]);
    await siteCreationPage.expectExpressCreationDisclaimer();
    await siteCreationPage.hideExpressCreationDisclaimer();
    await siteCreationPage.expectCreateProjectLink();
  });

  test("allows authenticated user to create a natural area site via express mode", async ({
    siteCreationPage,
  }) => {
    // Navigate to site creation page
    await siteCreationPage.goto();

    // Introduction
    await siteCreationPage.expectIntroductionStep();
    await siteCreationPage.clickStart();

    // Friche ?
    await siteCreationPage.selectIsFriche("no");

    // Nature du site
    await siteCreationPage.selectSiteNature("NATURAL_AREA");

    // Mode de création
    await siteCreationPage.selectCreateMode("express");

    // Type d'espace naturel
    await siteCreationPage.expectStepTitle("De quel type d'espace naturel s'agit-il ?");
    await siteCreationPage.expectStepperCurrentStep("Introduction");
    await siteCreationPage.selectNaturalAreaType("FOREST");

    // Adresse
    await siteCreationPage.expectStepTitle("Où est situé l'espace naturel ?");
    await siteCreationPage.expectStepperCurrentStep("Adresse");
    await siteCreationPage.fillAddress("Fontainebleau");

    // Surface du site
    await siteCreationPage.expectStepTitle("Quelle est la superficie totale de l'espace naturel ?");
    await siteCreationPage.expectStepperCurrentStep("Superficie");
    await siteCreationPage.fillSurfaceArea(25000);

    // Succès
    await siteCreationPage.expectCreationSuccessWithDataInList([
      ["Nature du site", "Forêt"],
      ["Superficie totale du site", "25 000 ㎡"],
      ["Adresse", "Fontainebleau"],
    ]);
    await siteCreationPage.expectExpressCreationDisclaimer();
    await siteCreationPage.hideExpressCreationDisclaimer();
    await siteCreationPage.expectCreateProjectLink();
  });
});

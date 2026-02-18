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
    await siteCreationPage.selectFricheActivity("INDUSTRY");

    // Adresse
    await siteCreationPage.fillAddress("Blajan");

    // Surface du site
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
    await siteCreationPage.selectAgriculturalActivity("POLYCULTURE_AND_LIVESTOCK");

    // Adresse
    await siteCreationPage.fillAddress("Lyon");

    // Surface du site
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
    await siteCreationPage.selectNaturalAreaType("FOREST");

    // Adresse
    await siteCreationPage.fillAddress("Fontainebleau");

    // Surface du site
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

import type { CreateCustomSiteDto } from "shared";

import { test } from "./fixtures";
import { createCustomSiteViaApi } from "../../../fixtures/helpers/site-creation.helpers";

type AgriculturalCustomSiteDto = Extract<CreateCustomSiteDto, { nature: "AGRICULTURAL_OPERATION" }>;
type FricheCustomSiteDto = Extract<CreateCustomSiteDto, { nature: "FRICHE" }>;

const BASE_AGRICULTURAL_SITE_DATA: Omit<AgriculturalCustomSiteDto, "id" | "createdBy" | "name"> = {
  nature: "AGRICULTURAL_OPERATION",
  agriculturalOperationActivity: "CEREALS_AND_OILSEEDS_CULTIVATION",
  isSiteOperated: true,
  address: {
    banId: "38229",
    value: "Meylan",
    city: "Meylan",
    cityCode: "38229",
    postCode: "38240",
    long: 5.7826,
    lat: 45.2116,
  },
  yearlyExpenses: [
    { purpose: "maintenance", amount: 9660, bearer: "owner" },
    { purpose: "propertyTaxes", amount: 6900, bearer: "owner" },
  ],
  yearlyIncomes: [],
  soilsDistribution: {
    IMPERMEABLE_SOILS: 1,
  },
  owner: { structureType: "municipality", name: "Mairie de Meylan" },
  tenant: { structureType: "company", name: "Société agricole" },
};

const BASE_FRICHE_SITE_DATA: Omit<FricheCustomSiteDto, "id" | "createdBy" | "name"> = {
  nature: "FRICHE",
  fricheActivity: "RAILWAY",
  description: "Ancienne friche ferroviaire en reconversion",
  address: {
    banId: "75109",
    value: "1 rue de Londres, 75009 Paris",
    city: "Paris",
    cityCode: "75109",
    postCode: "75009",
    long: 2.330785,
    lat: 48.876517,
    streetName: "rue de Londres",
  },
  owner: { structureType: "department", name: "Département de Paris" },
  tenant: { structureType: "company", name: "Exploitant ferroviaire" },
  yearlyExpenses: [{ purpose: "maintenance", amount: 45000, bearer: "owner" }],
  yearlyIncomes: [],
  accidentsDeaths: 0,
  accidentsSevereInjuries: 0,
  accidentsMinorInjuries: 0,
  contaminatedSoilSurface: 0,
  soilsDistribution: {
    BUILDINGS: 1,
  },
};

function createAgriculturalSiteData(
  name: string,
  soilsDistribution: AgriculturalCustomSiteDto["soilsDistribution"],
): Omit<AgriculturalCustomSiteDto, "id" | "createdBy"> {
  return {
    ...BASE_AGRICULTURAL_SITE_DATA,
    name,
    soilsDistribution,
  };
}

function createFricheSiteData(
  name: string,
  soilsDistribution: FricheCustomSiteDto["soilsDistribution"],
): Omit<FricheCustomSiteDto, "id" | "createdBy"> {
  return {
    ...BASE_FRICHE_SITE_DATA,
    name,
    soilsDistribution,
  };
}

test.describe("urban project creation - custom mode", () => {
  test.describe("agricultural operation without buildings", () => {
    test("allows creating a custom urban project for a site without buildings", async ({
      authenticatedApiClient,
      testUser,
      urbanProjectCreationPage,
    }) => {
      const testSite = await createCustomSiteViaApi(authenticatedApiClient)({
        ...createAgriculturalSiteData("Terrain agricole sans bâtiments", {
          IMPERMEABLE_SOILS: 2000,
          MINERAL_SOIL: 1500,
          ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 1500,
        }),
        createdBy: testUser.id,
      });

      await urbanProjectCreationPage.goto(testSite.id);

      // --- avancement du projet ---
      await urbanProjectCreationPage.expectStepperCurrentStep("Avancement du projet");
      await urbanProjectCreationPage.expectStepTitle("A quelle phase du projet êtes-vous");
      await urbanProjectCreationPage.selectProjectPhase("Montage / Développement");

      // --- connaissance du projet ---
      await urbanProjectCreationPage.selectCreateMode("custom");
      await urbanProjectCreationPage.selectProjectType("URBAN_PROJECT");

      // --- usages ---
      await urbanProjectCreationPage.expectStepperCurrentStep("Usages");
      await urbanProjectCreationPage.goToNextStep(); // uses introduction
      await urbanProjectCreationPage.expectStepTitle("Quels usages offrira le projet urbain");
      await urbanProjectCreationPage.selectUrbanProjectUses(["Logements", "Commerces"]);

      // --- sols et espaces ---
      await urbanProjectCreationPage.expectStepperCurrentStep("Sols et espaces");
      await urbanProjectCreationPage.goToNextStep(); // spaces introduction
      await urbanProjectCreationPage.selectProjectSpaces([
        "Bâtiments",
        "Allée ou parking imperméable",
      ]);
      await urbanProjectCreationPage.fillProjectSpacesSurfaceArea({
        Bâtiments: 3000,
        "Allée ou parking imperméable": 2000,
      });
      await urbanProjectCreationPage.expectStepTitle("Récapitulatif de l'occupation des sols");
      await urbanProjectCreationPage.goToNextStep(); // soils summary
      await urbanProjectCreationPage.expectStepTitle(
        "Stockage du carbone par les sols après aménagement",
      );
      await urbanProjectCreationPage.goToNextStep(); // carbon storage

      // --- bâtiments ---
      await urbanProjectCreationPage.expectStepperCurrentStep("Bâtiments");
      await urbanProjectCreationPage.goToNextStep(); // buildings introduction
      await urbanProjectCreationPage.expectStepTitle(
        "Quelle surface de plancher feront les différents usages",
      );
      await urbanProjectCreationPage.fillUsesFloorSurfaceArea({
        Logements: 2200,
        Commerces: 800,
      });
      await urbanProjectCreationPage.expectBuildingsNewConstructionIntroduction("3 000 ㎡");
      await urbanProjectCreationPage.goToNextStep(); // new construction introduction

      // --- cession foncière ---
      await urbanProjectCreationPage.expectStepperCurrentStep("Cession foncière");
      await urbanProjectCreationPage.goToNextStep(); // site resale introduction
      await urbanProjectCreationPage.expectStepTitle(
        "Y aura-t-il une cession foncière suite à l'aménagement du site",
      );
      await urbanProjectCreationPage.selectSiteResale(false);
      await urbanProjectCreationPage.expectStepTitle("les bâtiments seront-ils revendus");
      await urbanProjectCreationPage.selectBuildingsResale(true);

      // --- acteurs ---
      await urbanProjectCreationPage.expectStepperCurrentStep("Acteurs");
      await urbanProjectCreationPage.goToNextStep(); // stakeholders introduction
      await urbanProjectCreationPage.expectStepTitle("Qui sera l'aménageur du site");
      await urbanProjectCreationPage.selectStakeholder(/Ma structure/);
      await urbanProjectCreationPage.expectStepTitle("le constructeur des nouveaux bâtiments");
      await urbanProjectCreationPage.selectBuildingsDeveloper(true);

      // --- dépenses ---
      await urbanProjectCreationPage.expectStepperCurrentStep("Dépenses");
      await urbanProjectCreationPage.goToNextStep(); // expenses introduction
      await urbanProjectCreationPage.submitOrSkipStep();
      await urbanProjectCreationPage.submitOrSkipStep();
      await urbanProjectCreationPage.submitOrSkipStep();

      // --- recettes ---
      await urbanProjectCreationPage.expectStepperCurrentStep("Recettes");
      await urbanProjectCreationPage.goToNextStep(); // revenue introduction
      await urbanProjectCreationPage.submitOrSkipStep();
      await urbanProjectCreationPage.submitOrSkipStep();

      // --- calendrier ---
      await urbanProjectCreationPage.expectStepperCurrentStep("Calendrier");
      await urbanProjectCreationPage.expectStepTitle("Calendrier");
      await urbanProjectCreationPage.fillSchedule("09/2027", "03/2029", 2029);

      // --- dénomination ---
      await urbanProjectCreationPage.expectStepperCurrentStep("Dénomination");
      await urbanProjectCreationPage.expectStepTitle("Dénomination du projet");
      await urbanProjectCreationPage.fillNameAndDescription(
        "Projet urbain sans bâtiments existants",
      );

      // --- récapitulatif ---
      await urbanProjectCreationPage.expectFinalSummary();
      await urbanProjectCreationPage.submitFinalSummary();
      await urbanProjectCreationPage.expectCreationSuccess(
        "Projet urbain sans bâtiments existants",
      );
    });

    test("allows creating a custom urban project with only public green spaces for a site without buildings", async ({
      authenticatedApiClient,
      testUser,
      urbanProjectCreationPage,
    }) => {
      const testSite = await createCustomSiteViaApi(authenticatedApiClient)({
        ...createAgriculturalSiteData("Terrain agricole pour parc public", {
          MINERAL_SOIL: 2000,
          ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 3000,
        }),
        createdBy: testUser.id,
      });

      await urbanProjectCreationPage.goto(testSite.id);

      // --- avancement du projet ---
      await urbanProjectCreationPage.expectStepperCurrentStep("Avancement du projet");
      await urbanProjectCreationPage.expectStepTitle("A quelle phase du projet êtes-vous");
      await urbanProjectCreationPage.selectProjectPhase("Montage / Développement");

      // --- connaissance du projet ---
      await urbanProjectCreationPage.selectCreateMode("custom");
      await urbanProjectCreationPage.selectProjectType("URBAN_PROJECT");

      // --- usages ---
      await urbanProjectCreationPage.expectStepperCurrentStep("Usages");
      await urbanProjectCreationPage.goToNextStep(); // uses introduction
      await urbanProjectCreationPage.selectUrbanProjectUse("Espaces verts");

      // --- sols et espaces ---
      await urbanProjectCreationPage.expectStepperCurrentStep("Sols et espaces");
      await urbanProjectCreationPage.goToNextStep(); // spaces introduction
      await urbanProjectCreationPage.fillProjectSpacesSurfaceArea({
        "Allée ou parking perméable": 1500,
        "Espace végétalisé": 3500,
      });
      await urbanProjectCreationPage.expectStepTitle("Récapitulatif de l'occupation des sols");
      await urbanProjectCreationPage.goToNextStep(); // soils summary
      await urbanProjectCreationPage.expectStepTitle(
        "Stockage du carbone par les sols après aménagement",
      );
      await urbanProjectCreationPage.goToNextStep(); // carbon storage

      // --- cession foncière ---
      await urbanProjectCreationPage.expectStepperCurrentStep("Cession foncière");
      await urbanProjectCreationPage.goToNextStep(); // site resale introduction
      await urbanProjectCreationPage.expectStepTitle(
        "Y aura-t-il une cession foncière suite à l'aménagement du site",
      );
      await urbanProjectCreationPage.selectSiteResale(false);

      // --- acteurs ---
      await urbanProjectCreationPage.expectStepperCurrentStep("Acteurs");
      await urbanProjectCreationPage.goToNextStep(); // stakeholders introduction
      await urbanProjectCreationPage.expectStepTitle("Qui sera l'aménageur du site");
      await urbanProjectCreationPage.selectStakeholder(/Ma structure/);

      // --- dépenses ---
      await urbanProjectCreationPage.expectStepperCurrentStep("Dépenses");
      await urbanProjectCreationPage.goToNextStep(); // expenses introduction
      await urbanProjectCreationPage.submitOrSkipStep();
      await urbanProjectCreationPage.submitOrSkipStep();

      // --- recettes ---
      await urbanProjectCreationPage.expectStepperCurrentStep("Recettes");
      await urbanProjectCreationPage.goToNextStep(); // revenue introduction
      await urbanProjectCreationPage.submitOrSkipStep();

      // --- calendrier ---
      await urbanProjectCreationPage.expectStepperCurrentStep("Calendrier");
      await urbanProjectCreationPage.expectStepTitle("Calendrier");
      await urbanProjectCreationPage.fillSchedule("09/2027", "03/2029", 2029);

      // --- dénomination ---
      await urbanProjectCreationPage.expectStepperCurrentStep("Dénomination");
      await urbanProjectCreationPage.expectStepTitle("Dénomination du projet");
      await urbanProjectCreationPage.fillNameAndDescription("Projet de parc public");

      // --- récapitulatif ---
      await urbanProjectCreationPage.expectFinalSummary();
      await urbanProjectCreationPage.submitFinalSummary();
      await urbanProjectCreationPage.expectCreationSuccess("Projet de parc public");
    });
  });

  test.describe("friche with existing buildings", () => {
    test("allows creating a custom urban project on a friche with full demolition and new construction", async ({
      authenticatedApiClient,
      testUser,
      urbanProjectCreationPage,
    }) => {
      const testSite = await createCustomSiteViaApi(authenticatedApiClient)({
        ...createFricheSiteData("Friche ferroviaire avec bâtiments à démolir", {
          BUILDINGS: 2000,
          IMPERMEABLE_SOILS: 1000,
          MINERAL_SOIL: 2000,
        }),
        createdBy: testUser.id,
      });

      await urbanProjectCreationPage.goto(testSite.id);

      // --- avancement du projet ---
      await urbanProjectCreationPage.expectStepperCurrentStep("Avancement du projet");
      await urbanProjectCreationPage.expectStepTitle("A quelle phase du projet êtes-vous");
      await urbanProjectCreationPage.selectProjectPhase("Montage / Développement");

      // --- connaissance du projet ---
      await urbanProjectCreationPage.selectCreateMode("custom");
      await urbanProjectCreationPage.selectProjectType("URBAN_PROJECT");

      // --- usages ---
      await urbanProjectCreationPage.expectStepperCurrentStep("Usages");
      await urbanProjectCreationPage.goToNextStep(); // uses introduction
      await urbanProjectCreationPage.expectStepTitle("Quels usages offrira le projet urbain");
      await urbanProjectCreationPage.selectUrbanProjectUses(["Logements", "Commerces"]);

      // --- sols et espaces ---
      await urbanProjectCreationPage.expectStepperCurrentStep("Sols et espaces");
      await urbanProjectCreationPage.goToNextStep(); // spaces introduction
      await urbanProjectCreationPage.selectProjectSpaces([
        "Bâtiments",
        "Allée ou parking imperméable",
      ]);
      await urbanProjectCreationPage.fillProjectSpacesSurfaceArea({
        Bâtiments: 3000,
        "Allée ou parking imperméable": 2000,
      });
      await urbanProjectCreationPage.expectStepTitle("Récapitulatif de l'occupation des sols");
      await urbanProjectCreationPage.goToNextStep(); // soils summary
      await urbanProjectCreationPage.expectStepTitle(
        "Stockage du carbone par les sols après aménagement",
      );
      await urbanProjectCreationPage.goToNextStep(); // carbon storage

      // --- bâtiments ---
      await urbanProjectCreationPage.expectStepperCurrentStep("Bâtiments");
      await urbanProjectCreationPage.goToNextStep(); // buildings introduction
      await urbanProjectCreationPage.expectStepTitle(
        "Quelle surface de plancher feront les différents usages",
      );
      await urbanProjectCreationPage.fillUsesFloorSurfaceArea({
        Logements: 2200,
        Commerces: 800,
      });
      await urbanProjectCreationPage.expectBuildingsReuseIntroduction();
      await urbanProjectCreationPage.goToNextStep(); // reuse introduction
      await urbanProjectCreationPage.fillBuildingsFootprintToReuse(0);
      await urbanProjectCreationPage.expectBuildingsDemolitionInfo("2 000 ㎡");
      await urbanProjectCreationPage.goToNextStep(); // demolition info
      await urbanProjectCreationPage.expectBuildingsNewConstructionInfo("3 000 ㎡");
      await urbanProjectCreationPage.goToNextStep(); // new construction info

      // --- cession foncière ---
      await urbanProjectCreationPage.expectStepperCurrentStep("Cession foncière");
      await urbanProjectCreationPage.goToNextStep(); // site resale introduction
      await urbanProjectCreationPage.expectStepTitle(
        "Y aura-t-il une cession foncière suite à l'aménagement du site",
      );
      await urbanProjectCreationPage.selectSiteResale(false);
      await urbanProjectCreationPage.expectStepTitle("les bâtiments seront-ils revendus");
      await urbanProjectCreationPage.selectBuildingsResale(true);

      // --- acteurs ---
      await urbanProjectCreationPage.expectStepperCurrentStep("Acteurs");
      await urbanProjectCreationPage.goToNextStep(); // stakeholders introduction
      await urbanProjectCreationPage.expectStepTitle("Qui sera l'aménageur du site");
      await urbanProjectCreationPage.selectStakeholder(/Ma structure/);
      await urbanProjectCreationPage.expectStepTitle("le constructeur des nouveaux bâtiments");
      await urbanProjectCreationPage.selectBuildingsDeveloper(true);
      await urbanProjectCreationPage.selectStakeholder(/Ma structure/);

      // --- dépenses ---
      await urbanProjectCreationPage.expectStepperCurrentStep("Dépenses");
      await urbanProjectCreationPage.goToNextStep(); // expenses introduction
      await urbanProjectCreationPage.submitOrSkipStep();
      await urbanProjectCreationPage.submitOrSkipStep();
      await urbanProjectCreationPage.submitOrSkipStep();
      await urbanProjectCreationPage.submitOrSkipStep();

      // --- recettes ---
      await urbanProjectCreationPage.expectStepperCurrentStep("Recettes");
      await urbanProjectCreationPage.goToNextStep(); // revenue introduction
      await urbanProjectCreationPage.submitOrSkipStep();
      await urbanProjectCreationPage.submitOrSkipStep();

      // --- calendrier ---
      await urbanProjectCreationPage.expectStepperCurrentStep("Calendrier");
      await urbanProjectCreationPage.expectStepTitle("Calendrier");
      await urbanProjectCreationPage.fillSchedule("09/2027", "03/2029", 2029);

      // --- dénomination ---
      await urbanProjectCreationPage.expectStepperCurrentStep("Dénomination");
      await urbanProjectCreationPage.expectStepTitle("Dénomination du projet");
      await urbanProjectCreationPage.fillNameAndDescription("Projet urbain sans réutilisation");

      // --- récapitulatif ---
      await urbanProjectCreationPage.expectFinalSummary();
      await urbanProjectCreationPage.submitFinalSummary();
      await urbanProjectCreationPage.expectCreationSuccess("Projet urbain sans réutilisation");
    });

    test("allows creating a custom urban project on a friche with full reuse plus additional new construction", async ({
      authenticatedApiClient,
      testUser,
      urbanProjectCreationPage,
    }) => {
      const testSite = await createCustomSiteViaApi(authenticatedApiClient)({
        ...createFricheSiteData("Friche ferroviaire avec bâtiments à réutiliser", {
          BUILDINGS: 2000,
          IMPERMEABLE_SOILS: 1000,
          MINERAL_SOIL: 2000,
        }),
        createdBy: testUser.id,
      });

      await urbanProjectCreationPage.goto(testSite.id);

      // --- avancement du projet ---
      await urbanProjectCreationPage.expectStepperCurrentStep("Avancement du projet");
      await urbanProjectCreationPage.expectStepTitle("A quelle phase du projet êtes-vous");
      await urbanProjectCreationPage.selectProjectPhase("Montage / Développement");

      // --- connaissance du projet ---
      await urbanProjectCreationPage.selectCreateMode("custom");
      await urbanProjectCreationPage.selectProjectType("URBAN_PROJECT");

      // --- usages ---
      await urbanProjectCreationPage.expectStepperCurrentStep("Usages");
      await urbanProjectCreationPage.goToNextStep(); // uses introduction
      await urbanProjectCreationPage.expectStepTitle("Quels usages offrira le projet urbain");
      await urbanProjectCreationPage.selectUrbanProjectUses(["Logements", "Commerces"]);

      // --- sols et espaces ---
      await urbanProjectCreationPage.expectStepperCurrentStep("Sols et espaces");
      await urbanProjectCreationPage.goToNextStep(); // spaces introduction
      await urbanProjectCreationPage.selectProjectSpaces([
        "Bâtiments",
        "Allée ou parking imperméable",
      ]);
      await urbanProjectCreationPage.fillProjectSpacesSurfaceArea({
        Bâtiments: 3000,
        "Allée ou parking imperméable": 2000,
      });
      await urbanProjectCreationPage.expectStepTitle("Récapitulatif de l'occupation des sols");
      await urbanProjectCreationPage.goToNextStep(); // soils summary
      await urbanProjectCreationPage.expectStepTitle(
        "Stockage du carbone par les sols après aménagement",
      );
      await urbanProjectCreationPage.goToNextStep(); // carbon storage

      // --- bâtiments ---
      await urbanProjectCreationPage.expectStepperCurrentStep("Bâtiments");
      await urbanProjectCreationPage.goToNextStep(); // buildings introduction
      await urbanProjectCreationPage.expectStepTitle(
        "Quelle surface de plancher feront les différents usages",
      );
      await urbanProjectCreationPage.fillUsesFloorSurfaceArea({
        Logements: 2200,
        Commerces: 800,
      });
      await urbanProjectCreationPage.expectBuildingsReuseIntroduction();
      await urbanProjectCreationPage.goToNextStep(); // reuse introduction
      await urbanProjectCreationPage.fillBuildingsFootprintToReuse(2000);
      await urbanProjectCreationPage.fillExistingBuildingsUsesFloorSurfaceArea({
        Logements: 1500,
        Commerces: 500,
      });
      await urbanProjectCreationPage.expectBuildingsNewConstructionInfo("1 000 ㎡");
      await urbanProjectCreationPage.goToNextStep(); // new construction info
      await urbanProjectCreationPage.fillNewBuildingsUsesFloorSurfaceArea({
        Logements: 700,
        Commerces: 300,
      });

      // --- cession foncière ---
      await urbanProjectCreationPage.expectStepperCurrentStep("Cession foncière");
      await urbanProjectCreationPage.goToNextStep(); // site resale introduction
      await urbanProjectCreationPage.expectStepTitle(
        "Y aura-t-il une cession foncière suite à l'aménagement du site",
      );
      await urbanProjectCreationPage.selectSiteResale(false);
      await urbanProjectCreationPage.expectStepTitle("les bâtiments seront-ils revendus");
      await urbanProjectCreationPage.selectBuildingsResale(true);

      // --- acteurs ---
      await urbanProjectCreationPage.expectStepperCurrentStep("Acteurs");
      await urbanProjectCreationPage.goToNextStep(); // stakeholders introduction
      await urbanProjectCreationPage.expectStepTitle("Qui sera l'aménageur du site");
      await urbanProjectCreationPage.selectStakeholder(/Ma structure/);
      await urbanProjectCreationPage.expectStepTitle("le constructeur des nouveaux bâtiments");
      await urbanProjectCreationPage.selectBuildingsDeveloper(true);
      await urbanProjectCreationPage.selectStakeholder(/Ma structure/);

      // --- dépenses ---
      await urbanProjectCreationPage.expectStepperCurrentStep("Dépenses");
      await urbanProjectCreationPage.goToNextStep(); // expenses introduction
      await urbanProjectCreationPage.submitOrSkipStep();
      await urbanProjectCreationPage.submitOrSkipStep();
      await urbanProjectCreationPage.submitOrSkipStep();
      await urbanProjectCreationPage.submitOrSkipStep();

      // --- recettes ---
      await urbanProjectCreationPage.expectStepperCurrentStep("Recettes");
      await urbanProjectCreationPage.goToNextStep(); // revenue introduction
      await urbanProjectCreationPage.submitOrSkipStep();
      await urbanProjectCreationPage.submitOrSkipStep();

      // --- calendrier ---
      await urbanProjectCreationPage.expectStepperCurrentStep("Calendrier");
      await urbanProjectCreationPage.expectStepTitle("Calendrier");
      await urbanProjectCreationPage.fillSchedule("09/2027", "03/2029", 2029);

      // --- dénomination ---
      await urbanProjectCreationPage.expectStepperCurrentStep("Dénomination");
      await urbanProjectCreationPage.expectStepTitle("Dénomination du projet");
      await urbanProjectCreationPage.fillNameAndDescription(
        "Projet urbain avec réutilisation complète des bâtiments existants",
      );

      // --- récapitulatif ---
      await urbanProjectCreationPage.expectFinalSummary();
      await urbanProjectCreationPage.submitFinalSummary();
      await urbanProjectCreationPage.expectCreationSuccess(
        "Projet urbain avec réutilisation complète des bâtiments existants",
      );
    });
  });
});

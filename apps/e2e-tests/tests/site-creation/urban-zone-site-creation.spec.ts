import { test } from "./urban-zone-site-creation.fixtures";

test.describe("site creation (urban zone)", () => {
  test("allows authenticated user to create an urban zone site with activity park manager", async ({
    siteCreationPage,
    urbanZoneSiteCreationPage,
  }) => {
    await siteCreationPage.goto();
    await siteCreationPage.expectIntroductionStep();
    await siteCreationPage.clickStart();

    // --- entry point ---
    await siteCreationPage.selectIsFriche("no");
    await siteCreationPage.selectSiteNature("URBAN_ZONE");
    await urbanZoneSiteCreationPage.selectUrbanZoneType("ECONOMIC_ACTIVITY_ZONE");
    await siteCreationPage.fillAddress("Chartres");
    await urbanZoneSiteCreationPage.goToNextStep(); // land parcels introduction
    await siteCreationPage.fillSurfaceArea(15_000);

    // --- land parcels ---
    await siteCreationPage.expectStepperCurrentStep("Surfaces foncières");
    await urbanZoneSiteCreationPage.selectLandParcels([
      "COMMERCIAL_ACTIVITY_AREA",
      "PUBLIC_SPACES",
    ]);
    await urbanZoneSiteCreationPage.fillLandParcelsSurfaceDistribution({
      COMMERCIAL_ACTIVITY_AREA: 12_000,
      PUBLIC_SPACES: 3_000,
    });

    // --- soils ---
    await siteCreationPage.expectStepperCurrentStep("Sols et espaces");
    await urbanZoneSiteCreationPage.goToNextStep(); // soils and spaces introduction
    await urbanZoneSiteCreationPage.fillSoilsDistributionForCurrentParcel({
      BUILDINGS: 8_000,
      IMPERMEABLE_SOILS: 4_000,
    });
    await urbanZoneSiteCreationPage.fillBuildingsFloorAreaForCurrentParcel(6_000);
    await urbanZoneSiteCreationPage.fillSoilsDistributionForCurrentParcel({
      MINERAL_SOIL: 2_000,
      ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 1_000,
    });
    await siteCreationPage.expectStepTitle("Récapitulatif de l'occupation des sols");
    await urbanZoneSiteCreationPage.goToNextStep(); // soils summary
    await siteCreationPage.expectStepTitle("Stockage du carbone par les sols");
    await urbanZoneSiteCreationPage.goToNextStep(); // carbon storage

    // --- contamination ---
    await siteCreationPage.expectStepTitle("Les sols de la zone urbaine sont peut-être pollués.");
    await siteCreationPage.expectStepperCurrentStep("Pollution");
    await siteCreationPage.goToNextStep(); // contamination introduction
    await siteCreationPage.expectStepTitle("Les sols de la zone sont-ils pollués ?");
    await urbanZoneSiteCreationPage.selectSoilsContamination("yes", 3000);

    // --- management ---
    await siteCreationPage.expectStepTitle("Parlons de la gestion et de l'activité du site");
    await siteCreationPage.expectStepperCurrentStep("Gestion et activité");
    await siteCreationPage.goToNextStep(); // management introduction
    await siteCreationPage.expectStepTitle("Qui est le gestionnaire de la zone commerciale ?");
    await urbanZoneSiteCreationPage.selectManager("activity_park_manager");
    await siteCreationPage.expectStepTitle(
      "Quelle est l'emprise foncière des locaux commerciaux vacants ou en friche ?",
    );
    await urbanZoneSiteCreationPage.fillVacantCommercialPremisesFootprint(500);
    await siteCreationPage.expectStepTitle(
      "Quelle est la surface de plancher des locaux commerciaux vacants ou en friche ?",
    );
    await urbanZoneSiteCreationPage.fillVacantCommercialPremisesFloorArea(1_000);
    await siteCreationPage.expectStepTitle(
      "Combien y a t-il d'emplois équivalents temps plein dans la zone d'activité commerciale ?",
    );
    await urbanZoneSiteCreationPage.fillFullTimeJobsEquivalent(10);

    // --- expenses and income ---
    await siteCreationPage.expectStepTitle(
      "Cette zone commerciale génère certainement des dépenses et des recettes.",
    );
    await siteCreationPage.expectStepperCurrentStep("Dépenses et recettes");
    await urbanZoneSiteCreationPage.goToNextStep(); // expenses introduction
    await siteCreationPage.expectStepTitle(
      "Dépenses annuelles liées à la gestion et la sécurisation des locaux commerciaux vacants ou en friche",
    );
    await urbanZoneSiteCreationPage.fillActivityParkManagerExpenses({
      vacantPremisesExpenses: { ownerMaintenance: 5_000, tenantRent: 2_000 },
      zoneManagementExpenses: { maintenance: 10_000 },
      zoneManagementIncome: { rent: 50_000 },
    });
    await siteCreationPage.expectStepTitle(
      "Récapitulatif des dépenses et recettes annuelles liées à la zone commerciale",
    );
    await urbanZoneSiteCreationPage.goToNextStep(); // expenses summary

    // --- naming ---
    await siteCreationPage.expectStepTitle("Quelle est l'identité de ce site ?");
    await siteCreationPage.expectStepperCurrentStep("Dénomination");
    await siteCreationPage.goToNextStep(); // naming introduction
    await siteCreationPage.expectStepTitle("Dénomination du site");
    await siteCreationPage.expectGeneratedSiteName("Zone urbaine de Chartres");
    await urbanZoneSiteCreationPage.fillSiteNameAndDescription(
      "ZAE Chartres",
      "Zone d'activités économiques sur la commune de Chartres.",
    );

    // --- summary and creation ---
    await urbanZoneSiteCreationPage.expectFinalSummary();
    await urbanZoneSiteCreationPage.expectFinalSummaryManagerLabel(
      "Gestionnaire de parc d'activité",
    );
    await urbanZoneSiteCreationPage.createSite();
    await urbanZoneSiteCreationPage.expectCreationSuccess("ZAE Chartres");
  });

  test("allows authenticated user to create an urban zone site with no vacant premises", async ({
    siteCreationPage,
    urbanZoneSiteCreationPage,
  }) => {
    await siteCreationPage.goto();
    await siteCreationPage.expectIntroductionStep();
    await siteCreationPage.clickStart();

    // --- entry point ---
    await siteCreationPage.selectIsFriche("no");
    await siteCreationPage.selectSiteNature("URBAN_ZONE");
    await urbanZoneSiteCreationPage.selectUrbanZoneType("ECONOMIC_ACTIVITY_ZONE");
    await siteCreationPage.fillAddress("Chartres");
    await urbanZoneSiteCreationPage.goToNextStep(); // land parcels introduction
    await siteCreationPage.fillSurfaceArea(10_000);

    // --- land parcels ---
    // Note: single parcel → surface distribution step is auto-skipped (shortcut assigns 100% to the single parcel)
    await siteCreationPage.expectStepperCurrentStep("Surfaces foncières");
    await urbanZoneSiteCreationPage.selectLandParcels(["COMMERCIAL_ACTIVITY_AREA"]);

    // --- soils ---
    await siteCreationPage.expectStepperCurrentStep("Sols et espaces");
    await urbanZoneSiteCreationPage.goToNextStep(); // soils and spaces introduction
    await urbanZoneSiteCreationPage.fillSoilsDistributionForCurrentParcel({
      BUILDINGS: 5_000,
      IMPERMEABLE_SOILS: 5_000,
    });
    await urbanZoneSiteCreationPage.fillBuildingsFloorAreaForCurrentParcel(3_000);
    await urbanZoneSiteCreationPage.goToNextStep(); // soils summary
    await urbanZoneSiteCreationPage.goToNextStep(); // carbon storage

    // --- contamination ---
    await siteCreationPage.expectStepperCurrentStep("Pollution");
    await siteCreationPage.goToNextStep(); // contamination introduction
    await urbanZoneSiteCreationPage.selectSoilsContamination("no");

    // --- management (footprint = 0 → floor area step skipped) ---
    await siteCreationPage.expectStepperCurrentStep("Gestion et activité");
    await siteCreationPage.goToNextStep(); // management introduction
    await siteCreationPage.expectStepTitle("Qui est le gestionnaire de la zone commerciale ?");
    await urbanZoneSiteCreationPage.selectManager("activity_park_manager");
    await siteCreationPage.expectStepTitle(
      "Quelle est l'emprise foncière des locaux commerciaux vacants ou en friche ?",
    );
    await urbanZoneSiteCreationPage.fillVacantCommercialPremisesFootprint(0);
    await siteCreationPage.expectStepTitle(
      "Combien y a t-il d'emplois équivalents temps plein dans la zone d'activité commerciale ?",
    );
    await urbanZoneSiteCreationPage.fillFullTimeJobsEquivalent(40);

    // --- expenses and income (vacant premises step skipped, zone management shown) ---
    await siteCreationPage.expectStepTitle(
      "Cette zone commerciale génère certainement des dépenses et des recettes.",
    );
    await siteCreationPage.expectStepperCurrentStep("Dépenses et recettes");
    await urbanZoneSiteCreationPage.goToNextStep(); // expenses introduction
    await siteCreationPage.expectStepTitle(
      "Dépenses annuelles liées à la gestion de la zone commerciale",
    );
    await urbanZoneSiteCreationPage.fillActivityParkManagerExpenses({
      zoneManagementExpenses: { maintenance: 8_000 },
      zoneManagementIncome: { rent: 40_000 },
    });
    await siteCreationPage.expectStepTitle(
      "Récapitulatif des dépenses et recettes annuelles liées à la zone commerciale",
    );
    await urbanZoneSiteCreationPage.goToNextStep(); // expenses summary

    // --- naming ---
    await siteCreationPage.expectStepTitle("Quelle est l'identité de ce site ?");
    await siteCreationPage.expectStepperCurrentStep("Dénomination");
    await siteCreationPage.goToNextStep(); // naming introduction
    await siteCreationPage.expectStepTitle("Dénomination du site");
    await urbanZoneSiteCreationPage.fillSiteNameAndDescription("ZAE Sans Vacants");

    // --- summary and creation ---
    await urbanZoneSiteCreationPage.expectFinalSummary();
    await urbanZoneSiteCreationPage.expectFinalSummaryManagerLabel(
      "Gestionnaire de parc d'activité",
    );
    await urbanZoneSiteCreationPage.createSite();
    await urbanZoneSiteCreationPage.expectCreationSuccess("ZAE Sans Vacants");
  });

  test("allows authenticated user to create an urban zone site with local authority manager", async ({
    siteCreationPage,
    urbanZoneSiteCreationPage,
  }) => {
    await siteCreationPage.goto();
    await siteCreationPage.expectIntroductionStep();
    await siteCreationPage.clickStart();

    // --- entry point ---
    await siteCreationPage.selectIsFriche("no");
    await siteCreationPage.selectSiteNature("URBAN_ZONE");
    await urbanZoneSiteCreationPage.selectUrbanZoneType("ECONOMIC_ACTIVITY_ZONE");
    await siteCreationPage.fillAddress("Chartres");
    await urbanZoneSiteCreationPage.goToNextStep(); // land parcels introduction
    await siteCreationPage.fillSurfaceArea(10_000);

    // --- land parcels ---
    // Note: single parcel → surface distribution step is auto-skipped (shortcut assigns 100% to the single parcel)
    await siteCreationPage.expectStepperCurrentStep("Surfaces foncières");
    await urbanZoneSiteCreationPage.selectLandParcels(["COMMERCIAL_ACTIVITY_AREA"]);

    // --- soils ---
    await siteCreationPage.expectStepperCurrentStep("Sols et espaces");
    await urbanZoneSiteCreationPage.goToNextStep(); // soils and spaces introduction
    await urbanZoneSiteCreationPage.fillSoilsDistributionForCurrentParcel({
      BUILDINGS: 5_000,
      IMPERMEABLE_SOILS: 5_000,
    });
    await urbanZoneSiteCreationPage.fillBuildingsFloorAreaForCurrentParcel(3_000);
    await urbanZoneSiteCreationPage.goToNextStep(); // soils summary
    await urbanZoneSiteCreationPage.goToNextStep(); // carbon storage

    // --- contamination ---
    await siteCreationPage.expectStepperCurrentStep("Pollution");
    await siteCreationPage.goToNextStep(); // contamination introduction
    await urbanZoneSiteCreationPage.selectSoilsContamination("no");

    // --- management ---
    await siteCreationPage.expectStepperCurrentStep("Gestion et activité");
    await siteCreationPage.goToNextStep(); // management introduction
    await siteCreationPage.expectStepTitle("Qui est le gestionnaire de la zone commerciale ?");
    await urbanZoneSiteCreationPage.selectManager("local_authority", "municipality");
    await siteCreationPage.expectStepTitle(
      "Quelle est l'emprise foncière des locaux commerciaux vacants ou en friche ?",
    );
    await urbanZoneSiteCreationPage.fillVacantCommercialPremisesFootprint(0);
    await siteCreationPage.expectStepTitle(
      "Combien y a t-il d'emplois équivalents temps plein dans la zone d'activité commerciale ?",
    );
    await urbanZoneSiteCreationPage.fillFullTimeJobsEquivalent(5);

    // --- expenses and income ---
    await siteCreationPage.expectStepTitle(
      "Cette zone commerciale génère certainement des dépenses et des recettes.",
    );
    await siteCreationPage.expectStepperCurrentStep("Dépenses et recettes");
    await urbanZoneSiteCreationPage.goToNextStep(); // expenses introduction
    await siteCreationPage.expectStepTitle(
      "Dépenses annuelles liées à la gestion de la zone commerciale",
    );
    await urbanZoneSiteCreationPage.fillLocalAuthorityExpenses({ maintenance: 3_000 });

    // --- naming ---
    await siteCreationPage.expectStepTitle("Quelle est l'identité de ce site ?");
    await siteCreationPage.expectStepperCurrentStep("Dénomination");
    await siteCreationPage.goToNextStep(); // naming introduction
    await siteCreationPage.expectStepTitle("Dénomination du site");
    await urbanZoneSiteCreationPage.fillSiteNameAndDescription("ZAE Collectivite");

    // --- summary and creation ---
    await urbanZoneSiteCreationPage.expectFinalSummary();
    await urbanZoneSiteCreationPage.expectFinalSummaryManagerLabel("Mairie de Chartres");
    await urbanZoneSiteCreationPage.createSite();
    await urbanZoneSiteCreationPage.expectCreationSuccess("ZAE Collectivite");
  });
});

import { test } from "./urban-zone-site-creation.fixtures";

test.describe("site creation (urban zone)", () => {
  test("allows authenticated user to create an urban zone (zone d'activites economiques) site", async ({
    siteCreationPage,
    urbanZoneSiteCreationPage,
  }) => {
    await siteCreationPage.goto();
    await siteCreationPage.expectIntroductionStep();
    await siteCreationPage.clickStart();

    // --- Phase 2: entry point ---
    await siteCreationPage.selectIsFriche("no");
    await siteCreationPage.selectSiteNature("URBAN_ZONE");
    await urbanZoneSiteCreationPage.selectUrbanZoneType("ECONOMIC_ACTIVITY_ZONE");
    await siteCreationPage.fillAddress("Chartres");
    await urbanZoneSiteCreationPage.goToNextStep(); // land parcels introduction
    await siteCreationPage.fillSurfaceArea(15_000);

    // --- Phase 3: land parcels ---
    await siteCreationPage.expectStepperCurrentStep("Surfaces foncières");
    await urbanZoneSiteCreationPage.selectLandParcels([
      "COMMERCIAL_ACTIVITY_AREA",
      "PUBLIC_SPACES",
    ]);
    await urbanZoneSiteCreationPage.fillLandParcelsSurfaceDistribution({
      COMMERCIAL_ACTIVITY_AREA: 12_000,
      PUBLIC_SPACES: 3_000,
    });

    // --- Phase 4: per-parcel soils (parcel 1: COMMERCIAL_ACTIVITY_AREA) ---
    await siteCreationPage.expectStepperCurrentStep("Sols et espaces");
    await urbanZoneSiteCreationPage.goToNextStep(); // soils and spaces introduction
    await urbanZoneSiteCreationPage.fillSoilsDistributionForCurrentParcel({
      BUILDINGS: 8_000,
      IMPERMEABLE_SOILS: 4_000,
    });
    await urbanZoneSiteCreationPage.fillBuildingsFloorAreaForCurrentParcel(6_000);

    // per-parcel soils (parcel 2: PUBLIC_SPACES)
    await urbanZoneSiteCreationPage.fillSoilsDistributionForCurrentParcel({
      MINERAL_SOIL: 2_000,
      ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 1_000,
    });

    // soils summary
    await siteCreationPage.expectStepTitle("Récapitulatif de l'occupation des sols");
    await siteCreationPage.expectStepperCurrentStep("Sols et espaces");
    await urbanZoneSiteCreationPage.goToNextStep();

    // soils carbon storage
    await siteCreationPage.expectStepTitle("Stockage du carbone par les sols");
    await siteCreationPage.expectStepperCurrentStep("Sols et espaces");
    await urbanZoneSiteCreationPage.goToNextStep();

    // --- Phase 5: contamination ---
    await siteCreationPage.expectStepTitle("Les sols de la zone urbaine sont peut-être pollués.");
    await siteCreationPage.expectStepperCurrentStep("Pollution");
    await siteCreationPage.goToNextStep(); // contamination introduction

    await siteCreationPage.expectStepTitle("Les sols de la zone sont-ils pollués ?");
    await urbanZoneSiteCreationPage.selectSoilsContamination("yes", 3000);

    // --- Phase 5 and beyond: uncomment as each phase is implemented ---
    /*
     * // --- Phase 5: management ---
     * await siteCreationPage.goToNextStep(); // management introduction
     * await urbanZoneSiteCreationPage.selectManager("activity_park_manager");
     * await siteCreationPage.goToNextStep(); // vacant premises footprint (skip)
     * await siteCreationPage.goToNextStep(); // vacant premises floor area (skip)
     * await siteCreationPage.goToNextStep(); // FTE (skip)
     *
     * // --- Phase 6: naming ---
     * await siteCreationPage.goToNextStep(); // naming introduction
     * await urbanZoneSiteCreationPage.fillSiteNameAndDescription("Zone d'activités de Chartres");
     *
     * // --- Phase 6: final summary + creation ---
     * await urbanZoneSiteCreationPage.expectFinalSummary();
     * await urbanZoneSiteCreationPage.createSite();
     * await urbanZoneSiteCreationPage.expectCreationSuccess("Zone d'activités de Chartres");
     */
  });
});

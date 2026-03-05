import { test } from "./urban-zone-site-creation.fixtures";

test.describe("site creation (urban zone)", () => {
  // Full flow — implement each section as the corresponding phase lands.
  // See specs/urban-zone-mvp/SPEC.md for the phase breakdown and e2e maintenance instructions.
  test("allows authenticated user to create an urban zone (zone d'activites economiques) site", () => {
    // Remove this skip and uncomment the test body below when Phase 2 is complete.
    test.skip(true, "Not yet implemented — requires Phase 2 (entry point UI)");
  });

  /*
   * When Phase 2 is done, replace test.todo above with the test below and
   * uncomment sections as subsequent phases are completed.
   *
   * test("allows authenticated user to create an urban zone site", async ({
   *   siteCreationPage,
   *   urbanZoneSiteCreationPage,
   * }) => {
   *   await siteCreationPage.goto();
   *   await siteCreationPage.expectIntroductionStep();
   *   await siteCreationPage.clickStart();
   *
   *   // --- Phase 2: entry point ---
   *   await siteCreationPage.selectIsFriche("no");
   *   await siteCreationPage.selectSiteNature("URBAN_ZONE");
   *   await urbanZoneSiteCreationPage.selectUrbanZoneType("ECONOMIC_ACTIVITY_ZONE");
   *   await siteCreationPage.selectCreateMode("custom");
   *   await siteCreationPage.fillAddress("Chartres");
   *   await siteCreationPage.fillSurfaceArea(15_000);
   *
   *   // --- Phase 3: land parcels ---
   *   await urbanZoneSiteCreationPage.selectLandParcels([
   *     "COMMERCIAL_ACTIVITY_AREA",
   *     "PUBLIC_SPACES",
   *   ]);
   *   await urbanZoneSiteCreationPage.fillLandParcelsSurfaceDistribution({
   *     COMMERCIAL_ACTIVITY_AREA: 12_000,
   *     PUBLIC_SPACES: 3_000,
   *   });
   *
   *   // --- Phase 4: per-parcel soils (parcel 1: COMMERCIAL_ACTIVITY_AREA) ---
   *   await urbanZoneSiteCreationPage.selectSoilsForCurrentParcel(["BUILDINGS", "IMPERMEABLE_SOILS"]);
   *   await urbanZoneSiteCreationPage.fillSoilsDistributionForCurrentParcel({
   *     BUILDINGS: 8_000,
   *     IMPERMEABLE_SOILS: 4_000,
   *   });
   *   await urbanZoneSiteCreationPage.fillBuildingsFloorAreaForCurrentParcel(6_000);
   *
   *   // per-parcel soils (parcel 2: PUBLIC_SPACES)
   *   await urbanZoneSiteCreationPage.selectSoilsForCurrentParcel([
   *     "MINERAL_SOIL",
   *     "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
   *   ]);
   *   await urbanZoneSiteCreationPage.fillSoilsDistributionForCurrentParcel({
   *     MINERAL_SOIL: 2_000,
   *     ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 1_000,
   *   });
   *
   *   // soils summary
   *   await siteCreationPage.goToNextStep();
   *
   *   // --- Phase 5: contamination ---
   *   await siteCreationPage.goToNextStep(); // contamination introduction
   *   await urbanZoneSiteCreationPage.selectSoilsContamination("no");
   *
   *   // --- Phase 5: management ---
   *   await siteCreationPage.goToNextStep(); // management introduction
   *   await urbanZoneSiteCreationPage.selectManager("activity_park_manager");
   *   await siteCreationPage.goToNextStep(); // vacant premises footprint (skip)
   *   await siteCreationPage.goToNextStep(); // vacant premises floor area (skip)
   *   await siteCreationPage.goToNextStep(); // FTE (skip)
   *
   *   // --- Phase 6: naming ---
   *   await siteCreationPage.goToNextStep(); // naming introduction
   *   await urbanZoneSiteCreationPage.fillSiteNameAndDescription("Zone d'activités de Chartres");
   *
   *   // --- Phase 6: final summary + creation ---
   *   await urbanZoneSiteCreationPage.expectFinalSummary();
   *   await urbanZoneSiteCreationPage.createSite();
   *   await urbanZoneSiteCreationPage.expectCreationSuccess("Zone d'activités de Chartres");
   * });
   */
});

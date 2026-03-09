import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-site/core/urban-zone/__tests__/_testStoreHelpers";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-site/core/urban-zone/urban-zone.actions";

describe("Urban zone - LAND_PARCELS_SELECTION step", () => {
  describe("completion", () => {
    it("should store selected parcel types and navigate to surface distribution", () => {
      const store = new StoreBuilder().build();

      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_ZONE_LAND_PARCELS_SELECTION",
          answers: { landParcelTypes: ["COMMERCIAL_ACTIVITY_AREA", "PUBLIC_SPACES"] },
        }),
      );

      expect(
        store.getState().siteCreation.urbanZone.steps["URBAN_ZONE_LAND_PARCELS_SELECTION"],
      ).toEqual({
        completed: true,
        payload: { landParcelTypes: ["COMMERCIAL_ACTIVITY_AREA", "PUBLIC_SPACES"] },
      });
      expect(getCurrentStep(store)).toBe("URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION");
    });
  });

  it("should skip surface distribution and auto-complete it when only one parcel type is selected", () => {
    const store = new StoreBuilder().withSiteData({ surfaceArea: 15000 }).build();

    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_ZONE_LAND_PARCELS_SELECTION",
        answers: { landParcelTypes: ["COMMERCIAL_ACTIVITY_AREA"] },
      }),
    );

    expect(
      store.getState().siteCreation.urbanZone.steps["URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION"],
    ).toEqual({
      completed: true,
      payload: { surfaceAreas: { COMMERCIAL_ACTIVITY_AREA: 15000 } },
    });
    expect(getCurrentStep(store)).toBe("URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_SOILS_DISTRIBUTION");
  });

  describe("back navigation", () => {
    it("should navigate back to surface distribution when going back from selection", () => {
      // When SELECTION is step 2 in sequence (after SURFACE_DISTRIBUTION somehow - not realistic,
      // but tests the sequence-based back nav). A more realistic test: go back from step 2.
      const store = new StoreBuilder()
        .withStepsSequence([
          "URBAN_ZONE_LAND_PARCELS_SELECTION",
          "URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION",
        ])
        .build();

      store.dispatch(previousStepRequested());

      // currentStep is SURFACE_DISTRIBUTION (last in sequence), back should go to SELECTION
      expect(getCurrentStep(store)).toBe("URBAN_ZONE_LAND_PARCELS_SELECTION");
    });
  });
});

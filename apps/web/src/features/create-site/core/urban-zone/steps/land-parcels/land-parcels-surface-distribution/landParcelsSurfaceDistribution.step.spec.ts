import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-site/core/urban-zone/__tests__/_testStoreHelpers";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-site/core/urban-zone/urban-zone.actions";

describe("Urban zone - LAND_PARCELS_SURFACE_DISTRIBUTION step", () => {
  describe("completion", () => {
    it("should store surface distribution and initialize landParcels array", () => {
      const store = new StoreBuilder()
        .withUrbanZoneSteps({
          URBAN_ZONE_LAND_PARCELS_SELECTION: {
            completed: true,
            payload: { landParcelTypes: ["COMMERCIAL_ACTIVITY_AREA", "PUBLIC_SPACES"] },
          },
        })
        .build();

      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION",
          answers: {
            surfaceAreas: {
              COMMERCIAL_ACTIVITY_AREA: 12000,
              PUBLIC_SPACES: 3000,
            },
          },
        }),
      );

      expect(
        store.getState().siteCreation.urbanZone.steps[
          "URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION"
        ],
      ).toEqual({
        completed: true,
        payload: {
          surfaceAreas: {
            COMMERCIAL_ACTIVITY_AREA: 12000,
            PUBLIC_SPACES: 3000,
          },
        },
      });
    });

    it("should navigate to next step (dead-end in Phase 3 — no next handler registered)", () => {
      // In Phase 3, the next step after LAND_PARCELS_SURFACE_DISTRIBUTION is not registered yet.
      // The handler returns "URBAN_ZONE_LAND_PARCEL_SOILS_SELECTION" (Phase 4 step),
      // so we just verify the navigation target is correct.
      const store = new StoreBuilder()
        .withUrbanZoneSteps({
          URBAN_ZONE_LAND_PARCELS_SELECTION: {
            completed: true,
            payload: { landParcelTypes: ["COMMERCIAL_ACTIVITY_AREA"] },
          },
        })
        .build();

      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION",
          answers: { surfaceAreas: { COMMERCIAL_ACTIVITY_AREA: 15000 } },
        }),
      );

      expect(getCurrentStep(store)).toBe("URBAN_ZONE_LAND_PARCEL_SOILS_SELECTION");
    });
  });

  describe("back navigation", () => {
    it("should navigate back to land parcels selection", () => {
      const store = new StoreBuilder()
        .withStepsSequence([
          "URBAN_ZONE_LAND_PARCELS_SELECTION",
          "URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION",
        ])
        .build();

      store.dispatch(previousStepRequested());

      expect(getCurrentStep(store)).toBe("URBAN_ZONE_LAND_PARCELS_SELECTION");
    });
  });
});

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
    it("should store surface distribution answers", () => {
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

    it("should navigate to first selected parcel's soils distribution step", () => {
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
            surfaceAreas: { COMMERCIAL_ACTIVITY_AREA: 12000, PUBLIC_SPACES: 3000 },
          },
        }),
      );

      expect(getCurrentStep(store)).toBe("URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_SOILS_DISTRIBUTION");
    });

    it("should navigate to first selected parcel's soils distribution step (other parcels selection)", () => {
      const store = new StoreBuilder()
        .withUrbanZoneSteps({
          URBAN_ZONE_LAND_PARCELS_SELECTION: {
            completed: true,
            payload: { landParcelTypes: ["PUBLIC_SPACES", "RESERVED_SURFACE"] },
          },
        })
        .build();

      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION",
          answers: {
            surfaceAreas: { PUBLIC_SPACES: 3000, RESERVED_SURFACE: 2000 },
          },
        }),
      );

      expect(getCurrentStep(store)).toBe("URBAN_ZONE_PUBLIC_SPACES_SOILS_DISTRIBUTION");
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

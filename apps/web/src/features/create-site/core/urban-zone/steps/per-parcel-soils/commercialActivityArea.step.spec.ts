import type { UrbanZoneLandParcelType } from "shared";

import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-site/core/urban-zone/__tests__/_testStoreHelpers";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-site/core/urban-zone/urban-zone.actions";

describe("Urban zone - COMMERCIAL_ACTIVITY_AREA per-parcel steps", () => {
  const TWO_PARCELS_STEPS = {
    URBAN_ZONE_LAND_PARCELS_SELECTION: {
      completed: true,
      payload: {
        landParcelTypes: ["COMMERCIAL_ACTIVITY_AREA", "PUBLIC_SPACES"] as UrbanZoneLandParcelType[],
      },
    },
    URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION: {
      completed: true,
      payload: { surfaceAreas: { COMMERCIAL_ACTIVITY_AREA: 12000, PUBLIC_SPACES: 3000 } },
    },
  };

  const SINGLE_PARCEL_STEPS = {
    URBAN_ZONE_LAND_PARCELS_SELECTION: {
      completed: true,
      payload: {
        landParcelTypes: ["COMMERCIAL_ACTIVITY_AREA"] as UrbanZoneLandParcelType[],
      },
    },
    URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION: {
      completed: true,
      payload: { surfaceAreas: { COMMERCIAL_ACTIVITY_AREA: 12000 } },
    },
  };

  describe("soils distribution completion", () => {
    it("should navigate to buildings floor area when BUILDINGS present", () => {
      const store = new StoreBuilder()
        .withCurrentStep("URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_SOILS_DISTRIBUTION")
        .withUrbanZoneSteps(TWO_PARCELS_STEPS)
        .build();

      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_SOILS_DISTRIBUTION",
          answers: { soilsDistribution: { BUILDINGS: 8000, IMPERMEABLE_SOILS: 4000 } },
        }),
      );

      expect(getCurrentStep(store)).toBe(
        "URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_BUILDINGS_FLOOR_AREA",
      );
    });

    it("should navigate to next parcel's soils distribution when no BUILDINGS and more parcels", () => {
      const store = new StoreBuilder()
        .withCurrentStep("URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_SOILS_DISTRIBUTION")
        .withUrbanZoneSteps(TWO_PARCELS_STEPS)
        .build();

      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_SOILS_DISTRIBUTION",
          answers: { soilsDistribution: { MINERAL_SOIL: 12000 } },
        }),
      );

      expect(getCurrentStep(store)).toBe("URBAN_ZONE_PUBLIC_SPACES_SOILS_DISTRIBUTION");
    });

    it("should navigate to soils summary when no BUILDINGS and last parcel", () => {
      const store = new StoreBuilder()
        .withCurrentStep("URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_SOILS_DISTRIBUTION")
        .withUrbanZoneSteps(SINGLE_PARCEL_STEPS)
        .build();

      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_SOILS_DISTRIBUTION",
          answers: { soilsDistribution: { MINERAL_SOIL: 12000 } },
        }),
      );

      expect(getCurrentStep(store)).toBe("URBAN_ZONE_SOILS_SUMMARY");
    });
  });

  describe("buildings floor area completion", () => {
    it("should navigate to next parcel's soils distribution when more parcels", () => {
      const store = new StoreBuilder()
        .withCurrentStep("URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_BUILDINGS_FLOOR_AREA")
        .withUrbanZoneSteps(TWO_PARCELS_STEPS)
        .build();

      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_BUILDINGS_FLOOR_AREA",
          answers: { buildingsFloorSurfaceArea: 6000 },
        }),
      );

      expect(getCurrentStep(store)).toBe("URBAN_ZONE_PUBLIC_SPACES_SOILS_DISTRIBUTION");
    });

    it("should navigate to soils summary when last parcel", () => {
      const store = new StoreBuilder()
        .withCurrentStep("URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_BUILDINGS_FLOOR_AREA")
        .withUrbanZoneSteps(SINGLE_PARCEL_STEPS)
        .build();

      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_BUILDINGS_FLOOR_AREA",
          answers: { buildingsFloorSurfaceArea: 6000 },
        }),
      );

      expect(getCurrentStep(store)).toBe("URBAN_ZONE_SOILS_SUMMARY");
    });
  });

  describe("back navigation", () => {
    it("should go back to surface distribution from first parcel's soils distribution", () => {
      const store = new StoreBuilder()
        .withCurrentStep("URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_SOILS_DISTRIBUTION")
        .withUrbanZoneSteps(TWO_PARCELS_STEPS)
        .withStepsSequence([
          "URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION",
          "URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_SOILS_DISTRIBUTION",
        ])
        .build();

      store.dispatch(previousStepRequested());

      expect(getCurrentStep(store)).toBe("URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION");
    });

    it("should go back to soils distribution from buildings floor area", () => {
      const store = new StoreBuilder()
        .withCurrentStep("URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_BUILDINGS_FLOOR_AREA")
        .withUrbanZoneSteps(TWO_PARCELS_STEPS)
        .withStepsSequence([
          "URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_SOILS_DISTRIBUTION",
          "URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_BUILDINGS_FLOOR_AREA",
        ])
        .build();

      store.dispatch(previousStepRequested());

      expect(getCurrentStep(store)).toBe("URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_SOILS_DISTRIBUTION");
    });
  });
});

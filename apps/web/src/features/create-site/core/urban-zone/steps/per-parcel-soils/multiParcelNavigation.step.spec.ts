import type { UrbanZoneLandParcelType } from "shared";

import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-site/core/urban-zone/__tests__/_testStoreHelpers";
import {
  nextStepRequested,
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-site/core/urban-zone/urban-zone.actions";

describe("Urban zone - multi-parcel navigation", () => {
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

  it("should navigate full 2-parcel flow: COMMERCIAL_ACTIVITY_AREA with buildings → PUBLIC_SPACES without → summary", () => {
    const store = new StoreBuilder()
      .withCurrentStep("URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_SOILS_DISTRIBUTION")
      .withUrbanZoneSteps(TWO_PARCELS_STEPS)
      .build();

    // Parcel 1: soils distribution with BUILDINGS
    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_SOILS_DISTRIBUTION",
        answers: { soilsDistribution: { BUILDINGS: 8000, IMPERMEABLE_SOILS: 4000 } },
      }),
    );
    expect(getCurrentStep(store)).toBe("URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_BUILDINGS_FLOOR_AREA");

    // Parcel 1: buildings floor area
    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_BUILDINGS_FLOOR_AREA",
        answers: { buildingsFloorSurfaceArea: 6000 },
      }),
    );
    expect(getCurrentStep(store)).toBe("URBAN_ZONE_PUBLIC_SPACES_SOILS_DISTRIBUTION");

    // Parcel 2: soils distribution without buildings
    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_ZONE_PUBLIC_SPACES_SOILS_DISTRIBUTION",
        answers: {
          soilsDistribution: { MINERAL_SOIL: 2000, ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 1000 },
        },
      }),
    );
    expect(getCurrentStep(store)).toBe("URBAN_ZONE_SOILS_SUMMARY");
  });

  it("should navigate back from PUBLIC_SPACES soils distribution to COMMERCIAL_ACTIVITY_AREA buildings floor area", () => {
    const store = new StoreBuilder()
      .withCurrentStep("URBAN_ZONE_PUBLIC_SPACES_SOILS_DISTRIBUTION")
      .withUrbanZoneSteps({
        ...TWO_PARCELS_STEPS,
        URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_SOILS_DISTRIBUTION: {
          completed: true,
          payload: { soilsDistribution: { BUILDINGS: 8000, IMPERMEABLE_SOILS: 4000 } },
        },
        URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_BUILDINGS_FLOOR_AREA: {
          completed: true,
          payload: { buildingsFloorSurfaceArea: 6000 },
        },
      })
      .build();

    store.dispatch(previousStepRequested());

    expect(getCurrentStep(store)).toBe("URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_BUILDINGS_FLOOR_AREA");
  });

  it("should navigate back from soils summary to last parcel's last step", () => {
    const store = new StoreBuilder()
      .withCurrentStep("URBAN_ZONE_SOILS_SUMMARY")
      .withUrbanZoneSteps({
        ...TWO_PARCELS_STEPS,
        URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_SOILS_DISTRIBUTION: {
          completed: true,
          payload: { soilsDistribution: { BUILDINGS: 8000, IMPERMEABLE_SOILS: 4000 } },
        },
        URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_BUILDINGS_FLOOR_AREA: {
          completed: true,
          payload: { buildingsFloorSurfaceArea: 6000 },
        },
        URBAN_ZONE_PUBLIC_SPACES_SOILS_DISTRIBUTION: {
          completed: true,
          payload: { soilsDistribution: { MINERAL_SOIL: 2000 } },
        },
      })
      .build();

    store.dispatch(previousStepRequested());

    // PUBLIC_SPACES had no buildings, so back goes to its soils distribution
    expect(getCurrentStep(store)).toBe("URBAN_ZONE_PUBLIC_SPACES_SOILS_DISTRIBUTION");
  });

  it("should navigate forward from soils summary using nextStepRequested", () => {
    const store = new StoreBuilder()
      .withCurrentStep("URBAN_ZONE_SOILS_SUMMARY")
      .withUrbanZoneSteps(TWO_PARCELS_STEPS)
      .build();

    store.dispatch(nextStepRequested());

    expect(getCurrentStep(store)).toBe("URBAN_ZONE_SOILS_CONTAMINATION_INTRODUCTION");
  });
});

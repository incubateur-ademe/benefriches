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

describe("Urban zone - single parcel navigation", () => {
  const SINGLE_PARCEL_STEPS = {
    URBAN_ZONE_LAND_PARCELS_SELECTION: {
      completed: true,
      payload: {
        landParcelTypes: ["COMMERCIAL_ACTIVITY_AREA"] as UrbanZoneLandParcelType[],
      },
    },
    URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION: {
      completed: true,
      payload: { surfaceAreas: { COMMERCIAL_ACTIVITY_AREA: 15000 } },
    },
  };

  it("should navigate single parcel flow with buildings: soils → buildings → summary", () => {
    const store = new StoreBuilder()
      .withCurrentStep("URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_SOILS_DISTRIBUTION")
      .withUrbanZoneSteps(SINGLE_PARCEL_STEPS)
      .build();

    // Soils distribution with BUILDINGS
    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_SOILS_DISTRIBUTION",
        answers: { soilsDistribution: { BUILDINGS: 10000, IMPERMEABLE_SOILS: 5000 } },
      }),
    );
    expect(getCurrentStep(store)).toBe("URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_BUILDINGS_FLOOR_AREA");

    // Buildings floor area → soils summary (no next parcel)
    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_BUILDINGS_FLOOR_AREA",
        answers: { buildingsFloorSurfaceArea: 8000 },
      }),
    );
    expect(getCurrentStep(store)).toBe("URBAN_ZONE_SOILS_SUMMARY");
  });

  it("should navigate single parcel flow without buildings: soils → summary directly", () => {
    const store = new StoreBuilder()
      .withCurrentStep("URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_SOILS_DISTRIBUTION")
      .withUrbanZoneSteps(SINGLE_PARCEL_STEPS)
      .build();

    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_SOILS_DISTRIBUTION",
        answers: { soilsDistribution: { MINERAL_SOIL: 15000 } },
      }),
    );
    expect(getCurrentStep(store)).toBe("URBAN_ZONE_SOILS_SUMMARY");
  });

  it("should navigate back from soils distribution to surface distribution (single parcel, no previous parcel)", () => {
    const store = new StoreBuilder()
      .withCurrentStep("URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_SOILS_DISTRIBUTION")
      .withUrbanZoneSteps(SINGLE_PARCEL_STEPS)
      .build();

    store.dispatch(previousStepRequested());

    expect(getCurrentStep(store)).toBe("URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION");
  });

  it("should navigate back from soils summary to single parcel's last step (buildings floor area)", () => {
    const store = new StoreBuilder()
      .withCurrentStep("URBAN_ZONE_SOILS_SUMMARY")
      .withUrbanZoneSteps({
        ...SINGLE_PARCEL_STEPS,
        URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_SOILS_DISTRIBUTION: {
          completed: true,
          payload: { soilsDistribution: { BUILDINGS: 10000, IMPERMEABLE_SOILS: 5000 } },
        },
        URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_BUILDINGS_FLOOR_AREA: {
          completed: true,
          payload: { buildingsFloorSurfaceArea: 8000 },
        },
      })
      .build();

    store.dispatch(previousStepRequested());

    expect(getCurrentStep(store)).toBe("URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_BUILDINGS_FLOOR_AREA");
  });

  it("should navigate back from soils summary to single parcel's soils distribution (no buildings)", () => {
    const store = new StoreBuilder()
      .withCurrentStep("URBAN_ZONE_SOILS_SUMMARY")
      .withUrbanZoneSteps({
        ...SINGLE_PARCEL_STEPS,
        URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_SOILS_DISTRIBUTION: {
          completed: true,
          payload: { soilsDistribution: { MINERAL_SOIL: 15000 } },
        },
      })
      .build();

    store.dispatch(previousStepRequested());

    expect(getCurrentStep(store)).toBe("URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_SOILS_DISTRIBUTION");
  });

  it("should navigate forward from soils and spaces introduction to single parcel's soils distribution", () => {
    const store = new StoreBuilder()
      .withCurrentStep("URBAN_ZONE_SOILS_AND_SPACES_INTRODUCTION")
      .withUrbanZoneSteps(SINGLE_PARCEL_STEPS)
      .build();

    store.dispatch(nextStepRequested());

    expect(getCurrentStep(store)).toBe("URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_SOILS_DISTRIBUTION");
  });
});

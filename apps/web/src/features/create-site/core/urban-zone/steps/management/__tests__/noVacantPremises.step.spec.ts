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
import type { UrbanZoneStepsState } from "@/features/create-site/core/urban-zone/urbanZoneSteps";

const PREREQUISITE_STEPS = {
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
  URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_SOILS_DISTRIBUTION: {
    completed: true,
    payload: { soilsDistribution: { BUILDINGS: 10000, IMPERMEABLE_SOILS: 5000 } },
  },
  URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_BUILDINGS_FLOOR_AREA: {
    completed: true,
    payload: { buildingsFloorSurfaceArea: 8000 },
  },
} satisfies UrbanZoneStepsState;

describe("Urban zone - management navigation (no vacant premises)", () => {
  it("should navigate forward: intro → manager → footprint(0) → FTE → expenses intro", () => {
    const store = new StoreBuilder()
      .withCurrentStep("URBAN_ZONE_MANAGEMENT_INTRODUCTION")
      .withUrbanZoneSteps(PREREQUISITE_STEPS)
      .withSiteData({ surfaceArea: 15000 })
      .build();

    // Management introduction (info step)
    store.dispatch(nextStepRequested());
    expect(getCurrentStep(store)).toBe("URBAN_ZONE_MANAGER");

    // Manager
    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_ZONE_MANAGER",
        answers: { structureType: "activity_park_manager" },
      }),
    );
    expect(getCurrentStep(store)).toBe("URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT");

    // Footprint = 0 → skips floor area, goes to FTE
    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT",
        answers: { surfaceArea: 0 },
      }),
    );
    expect(getCurrentStep(store)).toBe("URBAN_ZONE_FULL_TIME_JOBS_EQUIVALENT");

    // FTE → expenses intro
    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_ZONE_FULL_TIME_JOBS_EQUIVALENT",
        answers: { fullTimeJobs: 10 },
      }),
    );
    expect(getCurrentStep(store)).toBe("URBAN_ZONE_EXPENSES_AND_INCOME_INTRODUCTION");
  });

  it("should navigate backward: expenses intro → FTE → footprint → manager → intro", () => {
    const COMPLETED_STEPS = {
      ...PREREQUISITE_STEPS,
      URBAN_ZONE_MANAGER: {
        completed: true,
        payload: { structureType: "activity_park_manager" as const },
      },
      URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT: {
        completed: true,
        payload: { surfaceArea: 0 },
      },
      URBAN_ZONE_FULL_TIME_JOBS_EQUIVALENT: {
        completed: true,
        payload: { fullTimeJobs: 10 },
      },
    } satisfies UrbanZoneStepsState;

    const store = new StoreBuilder()
      .withStepsSequence([
        "URBAN_ZONE_MANAGEMENT_INTRODUCTION",
        "URBAN_ZONE_MANAGER",
        "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT",
        "URBAN_ZONE_FULL_TIME_JOBS_EQUIVALENT",
        "URBAN_ZONE_EXPENSES_AND_INCOME_INTRODUCTION",
      ])
      .withUrbanZoneSteps(COMPLETED_STEPS)
      .withSiteData({ surfaceArea: 15000 })
      .build();

    // Expenses intro → FTE (getPreviousStepId: hasActivity=true)
    store.dispatch(previousStepRequested());
    expect(getCurrentStep(store)).toBe("URBAN_ZONE_FULL_TIME_JOBS_EQUIVALENT");

    // FTE → footprint (getPreviousStepId: footprint=0)
    store.dispatch(previousStepRequested());
    expect(getCurrentStep(store)).toBe("URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT");

    // Footprint → manager (stepsSequence fallback)
    store.dispatch(previousStepRequested());
    expect(getCurrentStep(store)).toBe("URBAN_ZONE_MANAGER");

    // Manager → intro (stepsSequence fallback)
    store.dispatch(previousStepRequested());
    expect(getCurrentStep(store)).toBe("URBAN_ZONE_MANAGEMENT_INTRODUCTION");
  });
});

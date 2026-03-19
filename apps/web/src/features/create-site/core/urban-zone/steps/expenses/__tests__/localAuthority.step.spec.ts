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
  URBAN_ZONE_MANAGER: {
    completed: true,
    payload: {
      structureType: "local_authority" as const,
      localAuthority: "municipality" as const,
      localAuthorityName: "Mairie de Paris",
    },
  },
  URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT: {
    completed: true,
    payload: { surfaceArea: 5000 },
  },
  URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FLOOR_AREA: {
    completed: true,
    payload: { surfaceArea: 3000 },
  },
  URBAN_ZONE_FULL_TIME_JOBS_EQUIVALENT: {
    completed: true,
    payload: { fullTimeJobs: 5 },
  },
} satisfies UrbanZoneStepsState;

describe("Urban zone - expenses navigation (local authority)", () => {
  it("should navigate forward: intro → local authority expenses → naming intro", () => {
    const store = new StoreBuilder()
      .withCurrentStep("URBAN_ZONE_EXPENSES_AND_INCOME_INTRODUCTION")
      .withUrbanZoneSteps(PREREQUISITE_STEPS)
      .withSiteData({ surfaceArea: 15000 })
      .build();

    // Expenses introduction (info step)
    store.dispatch(nextStepRequested());
    expect(getCurrentStep(store)).toBe("URBAN_ZONE_LOCAL_AUTHORITY_EXPENSES");

    // Local authority expenses → naming intro (bypasses summary)
    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_ZONE_LOCAL_AUTHORITY_EXPENSES",
        answers: { maintenance: 3000 },
      }),
    );
    expect(getCurrentStep(store)).toBe("URBAN_ZONE_NAMING_INTRODUCTION");
  });

  it("should navigate backward: naming intro → local authority expenses → intro", () => {
    const COMPLETED_STEPS = {
      ...PREREQUISITE_STEPS,
      URBAN_ZONE_LOCAL_AUTHORITY_EXPENSES: {
        completed: true,
        payload: { maintenance: 3000 },
      },
    } satisfies UrbanZoneStepsState;

    const store = new StoreBuilder()
      .withStepsSequence([
        "URBAN_ZONE_EXPENSES_AND_INCOME_INTRODUCTION",
        "URBAN_ZONE_LOCAL_AUTHORITY_EXPENSES",
        "URBAN_ZONE_NAMING_INTRODUCTION",
      ])
      .withUrbanZoneSteps(COMPLETED_STEPS)
      .withSiteData({ surfaceArea: 15000 })
      .build();

    // Naming intro → local authority expenses (getPreviousStepId: isLocalAuthority)
    store.dispatch(previousStepRequested());
    expect(getCurrentStep(store)).toBe("URBAN_ZONE_LOCAL_AUTHORITY_EXPENSES");

    // Local authority expenses → intro (getPreviousStepId)
    store.dispatch(previousStepRequested());
    expect(getCurrentStep(store)).toBe("URBAN_ZONE_EXPENSES_AND_INCOME_INTRODUCTION");
  });
});

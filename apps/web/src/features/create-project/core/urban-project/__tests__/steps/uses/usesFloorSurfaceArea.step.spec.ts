import { describe, expect, it } from "vitest";

import { creationProjectFormUrbanActions } from "../../../urbanProject.actions";
import { getCurrentStep, StoreBuilder } from "../../_testStoreHelpers";

describe("Urban project creation - Steps - Uses floor surface area", () => {
  it("should navigate to URBAN_PROJECT_BUILDINGS_INTRODUCTION when going back", () => {
    const store = new StoreBuilder()
      .withCurrentStep("URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA")
      .withSteps({
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL"] },
        },
      })
      .build();

    store.dispatch(creationProjectFormUrbanActions.previousStepRequested());

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_INTRODUCTION");
  });

  it("should complete step and go to URBAN_PROJECT_BUILDINGS_REUSE_INTRODUCTION when site has buildings", () => {
    const store = new StoreBuilder()
      .withSiteData({
        soilsDistribution: { BUILDINGS: 2500 },
        hasContaminatedSoils: false,
      } as never)
      .withSteps({
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL"] },
        },
      })
      .build();

    store.dispatch(
      creationProjectFormUrbanActions.stepCompletionRequested({
        stepId: "URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA",
        answers: {
          usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 15000 },
        },
      }),
    );

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_REUSE_INTRODUCTION");
  });

  it("should complete step and go to URBAN_PROJECT_BUILDINGS_NEW_CONSTRUCTION_INTRODUCTION when site has no buildings", () => {
    const store = new StoreBuilder()
      .withSiteData({
        soilsDistribution: { BUILDINGS: 0 },
        hasContaminatedSoils: false,
      } as never)
      .withSteps({
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL"] },
        },
      })
      .build();

    store.dispatch(
      creationProjectFormUrbanActions.stepCompletionRequested({
        stepId: "URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA",
        answers: {
          usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 15000 },
        },
      }),
    );

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_NEW_CONSTRUCTION_INTRODUCTION");
  });
});

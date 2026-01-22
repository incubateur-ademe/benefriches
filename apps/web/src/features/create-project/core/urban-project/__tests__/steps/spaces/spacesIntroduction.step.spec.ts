import { describe, it, expect } from "vitest";

import { creationProjectFormUrbanActions } from "../../../urbanProject.actions";
import { createTestStore, getCurrentStep } from "../../_testStoreHelpers";

describe("Urban project creation - Steps - Spaces introduction", () => {
  it("should go to URBAN_PROJECT_SPACES_SELECTION on next", () => {
    const store = createTestStore({
      currentStep: "URBAN_PROJECT_SPACES_INTRODUCTION",
      steps: {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL", "PUBLIC_GREEN_SPACES"] },
        },
        URBAN_PROJECT_USES_FOOTPRINT_SURFACE_AREA: {
          completed: true,
          payload: {
            usesFootprintSurfaceAreaDistribution: { RESIDENTIAL: 5000, PUBLIC_GREEN_SPACES: 5000 },
          },
        },
        URBAN_PROJECT_USES_FLOOR_SURFACE_AREA: {
          completed: true,
          payload: { usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 8000 } },
        },
      },
    });

    store.dispatch(creationProjectFormUrbanActions.navigateToNext());

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SPACES_SELECTION");
  });

  it("should go back to URBAN_PROJECT_USES_FLOOR_SURFACE_AREA when building uses exist", () => {
    const store = createTestStore({
      currentStep: "URBAN_PROJECT_SPACES_INTRODUCTION",
      steps: {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL", "PUBLIC_GREEN_SPACES"] },
        },
        URBAN_PROJECT_USES_FOOTPRINT_SURFACE_AREA: {
          completed: true,
          payload: {
            usesFootprintSurfaceAreaDistribution: { RESIDENTIAL: 5000, PUBLIC_GREEN_SPACES: 5000 },
          },
        },
        URBAN_PROJECT_USES_FLOOR_SURFACE_AREA: {
          completed: true,
          payload: { usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 8000 } },
        },
      },
    });

    store.dispatch(creationProjectFormUrbanActions.navigateToPrevious());

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_USES_FLOOR_SURFACE_AREA");
  });

  it("should go back to URBAN_PROJECT_USES_FOOTPRINT_SURFACE_AREA when only non-building uses exist", () => {
    const store = createTestStore({
      currentStep: "URBAN_PROJECT_SPACES_INTRODUCTION",
      steps: {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["PUBLIC_GREEN_SPACES", "OTHER_PUBLIC_SPACES"] },
        },
        URBAN_PROJECT_USES_FOOTPRINT_SURFACE_AREA: {
          completed: true,
          payload: {
            usesFootprintSurfaceAreaDistribution: {
              PUBLIC_GREEN_SPACES: 5000,
              OTHER_PUBLIC_SPACES: 5000,
            },
          },
        },
      },
    });

    store.dispatch(creationProjectFormUrbanActions.navigateToPrevious());

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_USES_FOOTPRINT_SURFACE_AREA");
  });
});

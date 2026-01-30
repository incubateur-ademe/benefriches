import { describe, it, expect } from "vitest";

import { creationProjectFormUrbanActions } from "../../../urbanProject.actions";
import { createTestStore, getCurrentStep } from "../../_testStoreHelpers";

describe("Urban project creation - Steps - Spaces surface area", () => {
  it("should complete step and go to URBAN_PROJECT_SPACES_SOILS_SUMMARY", () => {
    const store = createTestStore({
      currentStep: "URBAN_PROJECT_SPACES_SURFACE_AREA",
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
        URBAN_PROJECT_SPACES_SELECTION: {
          completed: true,
          payload: {
            spacesSelection: [
              "BUILDINGS",
              "IMPERMEABLE_SOILS",
              "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
            ],
          },
        },
      },
    });

    store.dispatch(
      creationProjectFormUrbanActions.requestStepCompletion({
        stepId: "URBAN_PROJECT_SPACES_SURFACE_AREA",
        answers: {
          spacesSurfaceAreaDistribution: {
            BUILDINGS: 3000,
            IMPERMEABLE_SOILS: 4000,
            ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 3000,
          },
        },
      }),
    );

    expect(store.getState().projectCreation.urbanProject.steps).toMatchObject({
      URBAN_PROJECT_SPACES_SURFACE_AREA: {
        completed: true,
        payload: {
          spacesSurfaceAreaDistribution: {
            BUILDINGS: 3000,
            IMPERMEABLE_SOILS: 4000,
            ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 3000,
          },
        },
      },
    });
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SPACES_SOILS_SUMMARY");
  });

  it("should return previous as URBAN_PROJECT_SPACES_SELECTION", () => {
    const store = createTestStore({
      currentStep: "URBAN_PROJECT_SPACES_SURFACE_AREA",
      steps: {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL"] },
        },
        URBAN_PROJECT_USES_FOOTPRINT_SURFACE_AREA: {
          completed: true,
          payload: { usesFootprintSurfaceAreaDistribution: { RESIDENTIAL: 10000 } },
        },
        URBAN_PROJECT_USES_FLOOR_SURFACE_AREA: {
          completed: true,
          payload: { usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 15000 } },
        },
        URBAN_PROJECT_SPACES_SELECTION: {
          completed: true,
          payload: { spacesSelection: ["BUILDINGS", "IMPERMEABLE_SOILS"] },
        },
      },
    });

    store.dispatch(creationProjectFormUrbanActions.navigateToPrevious());

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SPACES_SELECTION");
  });
});

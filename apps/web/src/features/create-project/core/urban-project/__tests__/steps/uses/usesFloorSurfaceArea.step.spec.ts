import { describe, it, expect } from "vitest";

import { ProjectFormState } from "@/shared/core/reducers/project-form/projectForm.reducer";

import { creationProjectFormUrbanActions } from "../../../urbanProject.actions";
import { createTestStore, getCurrentStep } from "../../_testStoreHelpers";

describe("Urban project creation - Steps - Uses floor surface area", () => {
  it("should complete step with floor area distribution and go to URBAN_PROJECT_SPACES_DEVELOPMENT_PLAN_INTRODUCTION", () => {
    const store = createTestStore({
      steps: {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL", "OFFICES"] },
        },
        URBAN_PROJECT_USES_FOOTPRINT_SURFACE_AREA: {
          completed: true,
          payload: { usesFootprintSurfaceAreaDistribution: { RESIDENTIAL: 5000, OFFICES: 5000 } },
        },
      },
    });

    store.dispatch(
      creationProjectFormUrbanActions.requestStepCompletion({
        stepId: "URBAN_PROJECT_USES_FLOOR_SURFACE_AREA",
        answers: {
          usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 10000, OFFICES: 7500 },
        },
      }),
    );

    expect(store.getState().projectCreation.urbanProject.steps).toEqual<
      ProjectFormState["urbanProject"]["steps"]
    >({
      URBAN_PROJECT_USES_SELECTION: {
        completed: true,
        payload: { usesSelection: ["RESIDENTIAL", "OFFICES"] },
      },
      URBAN_PROJECT_USES_FOOTPRINT_SURFACE_AREA: {
        completed: true,
        payload: { usesFootprintSurfaceAreaDistribution: { RESIDENTIAL: 5000, OFFICES: 5000 } },
      },
      URBAN_PROJECT_USES_FLOOR_SURFACE_AREA: {
        completed: true,
        payload: { usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 10000, OFFICES: 7500 } },
      },
    });
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SPACES_DEVELOPMENT_PLAN_INTRODUCTION");
  });

  it("should complete step for a single building use", () => {
    const store = createTestStore({
      steps: {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL"] },
        },
        URBAN_PROJECT_USES_FOOTPRINT_SURFACE_AREA: {
          completed: true,
          payload: { usesFootprintSurfaceAreaDistribution: { RESIDENTIAL: 10000 } },
        },
      },
    });

    store.dispatch(
      creationProjectFormUrbanActions.requestStepCompletion({
        stepId: "URBAN_PROJECT_USES_FLOOR_SURFACE_AREA",
        answers: {
          usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 15000 },
        },
      }),
    );

    expect(store.getState().projectCreation.urbanProject.steps).toEqual<
      ProjectFormState["urbanProject"]["steps"]
    >({
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
    });
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SPACES_DEVELOPMENT_PLAN_INTRODUCTION");
  });

  it("should complete step when mixed uses selected (only building uses should be in floor distribution)", () => {
    const store = createTestStore({
      steps: {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL", "PUBLIC_GREEN_SPACES", "OFFICES"] },
        },
        URBAN_PROJECT_USES_FOOTPRINT_SURFACE_AREA: {
          completed: true,
          payload: {
            usesFootprintSurfaceAreaDistribution: {
              RESIDENTIAL: 4000,
              PUBLIC_GREEN_SPACES: 3000,
              OFFICES: 3000,
            },
          },
        },
      },
    });

    store.dispatch(
      creationProjectFormUrbanActions.requestStepCompletion({
        stepId: "URBAN_PROJECT_USES_FLOOR_SURFACE_AREA",
        answers: {
          usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 8000, OFFICES: 6000 },
        },
      }),
    );

    expect(store.getState().projectCreation.urbanProject.steps).toEqual<
      ProjectFormState["urbanProject"]["steps"]
    >({
      URBAN_PROJECT_USES_SELECTION: {
        completed: true,
        payload: { usesSelection: ["RESIDENTIAL", "PUBLIC_GREEN_SPACES", "OFFICES"] },
      },
      URBAN_PROJECT_USES_FOOTPRINT_SURFACE_AREA: {
        completed: true,
        payload: {
          usesFootprintSurfaceAreaDistribution: {
            RESIDENTIAL: 4000,
            PUBLIC_GREEN_SPACES: 3000,
            OFFICES: 3000,
          },
        },
      },
      URBAN_PROJECT_USES_FLOOR_SURFACE_AREA: {
        completed: true,
        payload: { usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 8000, OFFICES: 6000 } },
      },
    });
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SPACES_DEVELOPMENT_PLAN_INTRODUCTION");
  });

  it("should navigate to URBAN_PROJECT_USES_FOOTPRINT_SURFACE_AREA when going back", () => {
    const store = createTestStore({
      currentStep: "URBAN_PROJECT_USES_FLOOR_SURFACE_AREA",
      steps: {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL"] },
        },
        URBAN_PROJECT_USES_FOOTPRINT_SURFACE_AREA: {
          completed: true,
          payload: { usesFootprintSurfaceAreaDistribution: { RESIDENTIAL: 10000 } },
        },
      },
    });

    store.dispatch(creationProjectFormUrbanActions.navigateToPrevious());

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_USES_FOOTPRINT_SURFACE_AREA");
  });
});

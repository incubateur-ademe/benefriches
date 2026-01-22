import { describe, it, expect } from "vitest";

import { ProjectFormState } from "@/shared/core/reducers/project-form/projectForm.reducer";
import { AnswersByStep } from "@/shared/core/reducers/project-form/urban-project/urbanProjectSteps";

import { creationProjectFormUrbanActions } from "../../../urbanProject.actions";
import { createTestStore, getCurrentStep } from "../../_testStoreHelpers";

describe("Urban project creation - Steps - Uses footprint surface area", () => {
  it("should complete step with footprint distribution and go to URBAN_PROJECT_USES_FLOOR_SURFACE_AREA when building uses are selected", () => {
    const store = createTestStore({
      steps: {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL", "PUBLIC_GREEN_SPACES"] },
        },
      },
    });

    store.dispatch(
      creationProjectFormUrbanActions.requestStepCompletion({
        stepId: "URBAN_PROJECT_USES_FOOTPRINT_SURFACE_AREA",
        answers: {
          usesFootprintSurfaceAreaDistribution: { RESIDENTIAL: 6000, PUBLIC_GREEN_SPACES: 4000 },
        },
      }),
    );

    expect(store.getState().projectCreation.urbanProject.steps).toEqual<
      ProjectFormState["urbanProject"]["steps"]
    >({
      URBAN_PROJECT_USES_SELECTION: {
        completed: true,
        payload: { usesSelection: ["RESIDENTIAL", "PUBLIC_GREEN_SPACES"] },
      },
      URBAN_PROJECT_USES_FOOTPRINT_SURFACE_AREA: {
        completed: true,
        payload: {
          usesFootprintSurfaceAreaDistribution: { RESIDENTIAL: 6000, PUBLIC_GREEN_SPACES: 4000 },
        },
      },
    });
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_USES_FLOOR_SURFACE_AREA");
  });

  it("should skip floor area step and go to URBAN_PROJECT_SPACES_INTRODUCTION when only non-building uses are selected", () => {
    const store = createTestStore({
      steps: {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["PUBLIC_GREEN_SPACES", "OTHER_PUBLIC_SPACES"] },
        },
      },
    });

    store.dispatch(
      creationProjectFormUrbanActions.requestStepCompletion({
        stepId: "URBAN_PROJECT_USES_FOOTPRINT_SURFACE_AREA",
        answers: {
          usesFootprintSurfaceAreaDistribution: {
            PUBLIC_GREEN_SPACES: 7000,
            OTHER_PUBLIC_SPACES: 3000,
          },
        },
      }),
    );

    expect(store.getState().projectCreation.urbanProject.steps).toEqual<
      ProjectFormState["urbanProject"]["steps"]
    >({
      URBAN_PROJECT_USES_SELECTION: {
        completed: true,
        payload: { usesSelection: ["PUBLIC_GREEN_SPACES", "OTHER_PUBLIC_SPACES"] },
      },
      URBAN_PROJECT_USES_FOOTPRINT_SURFACE_AREA: {
        completed: true,
        payload: {
          usesFootprintSurfaceAreaDistribution: {
            PUBLIC_GREEN_SPACES: 7000,
            OTHER_PUBLIC_SPACES: 3000,
          },
        },
      },
    });
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SPACES_INTRODUCTION");
  });

  it("should invalidate URBAN_PROJECT_USES_FLOOR_SURFACE_AREA when footprint distribution changes", () => {
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
        URBAN_PROJECT_USES_FLOOR_SURFACE_AREA: {
          completed: true,
          payload: { usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 7500, OFFICES: 7500 } },
        },
      },
    });

    const newAnswer = {
      usesFootprintSurfaceAreaDistribution: { RESIDENTIAL: 6000, OFFICES: 4000 },
    } satisfies AnswersByStep["URBAN_PROJECT_USES_FOOTPRINT_SURFACE_AREA"];

    store.dispatch(
      creationProjectFormUrbanActions.requestStepCompletion({
        stepId: "URBAN_PROJECT_USES_FOOTPRINT_SURFACE_AREA",
        answers: newAnswer,
      }),
    );

    expect(store.getState().projectCreation.urbanProject.pendingStepCompletion).toEqual<
      ProjectFormState["urbanProject"]["pendingStepCompletion"]
    >({
      showAlert: true,
      changes: {
        payload: {
          stepId: "URBAN_PROJECT_USES_FOOTPRINT_SURFACE_AREA",
          answers: newAnswer,
        },
        cascadingChanges: [
          { action: "invalidate", stepId: "URBAN_PROJECT_USES_FLOOR_SURFACE_AREA" },
        ],
        navigationTarget: "URBAN_PROJECT_USES_FLOOR_SURFACE_AREA",
      },
    });

    store.dispatch(creationProjectFormUrbanActions.confirmStepCompletion());

    expect(store.getState().projectCreation.urbanProject.steps).toEqual<
      ProjectFormState["urbanProject"]["steps"]
    >({
      URBAN_PROJECT_USES_SELECTION: {
        completed: true,
        payload: { usesSelection: ["RESIDENTIAL", "OFFICES"] },
      },
      URBAN_PROJECT_USES_FOOTPRINT_SURFACE_AREA: {
        completed: true,
        payload: newAnswer,
      },
      URBAN_PROJECT_USES_FLOOR_SURFACE_AREA: {
        completed: false,
      },
    });
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_USES_FLOOR_SURFACE_AREA");
  });

  it("should not trigger cascading changes when footprint distribution remains the same", () => {
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
        URBAN_PROJECT_USES_FLOOR_SURFACE_AREA: {
          completed: true,
          payload: { usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 7500, OFFICES: 7500 } },
        },
      },
    });

    store.dispatch(
      creationProjectFormUrbanActions.requestStepCompletion({
        stepId: "URBAN_PROJECT_USES_FOOTPRINT_SURFACE_AREA",
        answers: {
          usesFootprintSurfaceAreaDistribution: { RESIDENTIAL: 5000, OFFICES: 5000 },
        },
      }),
    );

    // No cascading changes, direct completion
    expect(store.getState().projectCreation.urbanProject.pendingStepCompletion).toBeUndefined();
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_USES_FLOOR_SURFACE_AREA");
  });

  it("should navigate to URBAN_PROJECT_USES_SELECTION when going back", () => {
    const store = createTestStore({
      currentStep: "URBAN_PROJECT_USES_FOOTPRINT_SURFACE_AREA",
      steps: {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL"] },
        },
      },
    });

    store.dispatch(creationProjectFormUrbanActions.navigateToPrevious());

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_USES_SELECTION");
  });
});

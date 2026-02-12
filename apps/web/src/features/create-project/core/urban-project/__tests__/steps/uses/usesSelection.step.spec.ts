import { describe, it, expect } from "vitest";

import { ProjectFormState } from "@/shared/core/reducers/project-form/projectForm.reducer";
import { AnswersByStep } from "@/shared/core/reducers/project-form/urban-project/urbanProjectSteps";

import { creationProjectFormUrbanActions } from "../../../urbanProject.actions";
import { createTestStore, getCurrentStep } from "../../_testStoreHelpers";

describe("Urban project creation - Steps - Uses selection", () => {
  it("should complete step with building uses and go to URBAN_PROJECT_USES_FLOOR_SURFACE_AREA", () => {
    const store = createTestStore();

    store.dispatch(
      creationProjectFormUrbanActions.requestStepCompletion({
        stepId: "URBAN_PROJECT_USES_SELECTION",
        answers: {
          usesSelection: ["RESIDENTIAL", "PUBLIC_GREEN_SPACES"],
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
    });
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_USES_FLOOR_SURFACE_AREA");
  });

  it("should complete step with only non-building uses and go to URBAN_PROJECT_SPACES_INTRODUCTION", () => {
    const store = createTestStore();

    store.dispatch(
      creationProjectFormUrbanActions.requestStepCompletion({
        stepId: "URBAN_PROJECT_USES_SELECTION",
        answers: {
          usesSelection: ["PUBLIC_GREEN_SPACES"],
        },
      }),
    );

    expect(store.getState().projectCreation.urbanProject.steps).toEqual<
      ProjectFormState["urbanProject"]["steps"]
    >({
      URBAN_PROJECT_USES_SELECTION: {
        completed: true,
        payload: { usesSelection: ["PUBLIC_GREEN_SPACES"] },
      },
    });
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SPACES_INTRODUCTION");
  });

  it("should delete URBAN_PROJECT_USES_FLOOR_SURFACE_AREA when uses selection changes", () => {
    const store = createTestStore({
      steps: {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL", "OFFICES"] },
        },
        URBAN_PROJECT_USES_FLOOR_SURFACE_AREA: {
          completed: true,
          payload: { usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 10000, OFFICES: 7500 } },
        },
      },
    });

    const newAnswer = {
      usesSelection: ["RESIDENTIAL", "PUBLIC_GREEN_SPACES"],
    } satisfies AnswersByStep["URBAN_PROJECT_USES_SELECTION"];

    store.dispatch(
      creationProjectFormUrbanActions.requestStepCompletion({
        stepId: "URBAN_PROJECT_USES_SELECTION",
        answers: newAnswer,
      }),
    );

    expect(store.getState().projectCreation.urbanProject.pendingStepCompletion).toEqual<
      ProjectFormState["urbanProject"]["pendingStepCompletion"]
    >({
      showAlert: true,
      changes: {
        payload: {
          stepId: "URBAN_PROJECT_USES_SELECTION",
          answers: newAnswer,
        },
        cascadingChanges: [{ action: "delete", stepId: "URBAN_PROJECT_USES_FLOOR_SURFACE_AREA" }],
        navigationTarget: "URBAN_PROJECT_USES_FLOOR_SURFACE_AREA",
      },
    });

    store.dispatch(creationProjectFormUrbanActions.confirmStepCompletion());

    expect(store.getState().projectCreation.urbanProject.steps).toEqual<
      ProjectFormState["urbanProject"]["steps"]
    >({
      URBAN_PROJECT_USES_SELECTION: {
        completed: true,
        payload: newAnswer,
      },
    });
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_USES_FLOOR_SURFACE_AREA");
  });

  it("should not trigger cascading changes when uses selection remains the same", () => {
    const store = createTestStore({
      steps: {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL", "OFFICES"] },
        },
        URBAN_PROJECT_USES_FLOOR_SURFACE_AREA: {
          completed: true,
          payload: { usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 10000, OFFICES: 7500 } },
        },
      },
    });

    store.dispatch(
      creationProjectFormUrbanActions.requestStepCompletion({
        stepId: "URBAN_PROJECT_USES_SELECTION",
        answers: {
          usesSelection: ["OFFICES", "RESIDENTIAL"], // Same uses, different order
        },
      }),
    );

    // No cascading changes, direct completion
    expect(store.getState().projectCreation.urbanProject.pendingStepCompletion).toBeUndefined();
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_USES_FLOOR_SURFACE_AREA");
  });
});

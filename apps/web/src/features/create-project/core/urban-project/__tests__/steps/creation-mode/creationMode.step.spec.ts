import { describe, it, expect } from "vitest";

import { ProjectFormState } from "@/shared/core/reducers/project-form/projectForm.reducer";

import { creationProjectFormUrbanActions } from "../../../urbanProject.actions";
import { createTestStore, getCurrentStep } from "../../_testStoreHelpers";

describe("Urban project creation - Steps - Creation mode selection", () => {
  it("should navigate to URBAN_PROJECT_EXPRESS_TEMPLATE_SELECTION when express mode selected", () => {
    const store = createTestStore();

    store.dispatch(
      creationProjectFormUrbanActions.requestStepCompletion({
        stepId: "URBAN_PROJECT_CREATE_MODE_SELECTION",
        answers: {
          createMode: "express",
        },
      }),
    );

    expect(store.getState().projectCreation.urbanProject.steps).toEqual<
      ProjectFormState["urbanProject"]["steps"]
    >({
      URBAN_PROJECT_CREATE_MODE_SELECTION: {
        completed: true,
        payload: { createMode: "express" },
      },
    });
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_EXPRESS_TEMPLATE_SELECTION");
  });

  it("should navigate to URBAN_PROJECT_USES_INTRODUCTION when custom mode selected", () => {
    const store = createTestStore();

    store.dispatch(
      creationProjectFormUrbanActions.requestStepCompletion({
        stepId: "URBAN_PROJECT_CREATE_MODE_SELECTION",
        answers: {
          createMode: "custom",
        },
      }),
    );

    expect(store.getState().projectCreation.urbanProject.steps).toEqual<
      ProjectFormState["urbanProject"]["steps"]
    >({
      URBAN_PROJECT_CREATE_MODE_SELECTION: {
        completed: true,
        payload: { createMode: "custom" },
      },
    });
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_USES_INTRODUCTION");
  });
});

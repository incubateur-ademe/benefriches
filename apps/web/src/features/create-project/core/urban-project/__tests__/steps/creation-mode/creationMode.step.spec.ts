import { describe, it, expect, vi, beforeEach } from "vitest";

import { ProjectFormState } from "@/shared/core/reducers/project-form/projectForm.reducer";
import { BENEFRICHES_ENV } from "@/shared/views/envVars";

import { creationProjectFormUrbanActions } from "../../../urbanProject.actions";
import { createTestStore, getCurrentStep } from "../../_testStoreHelpers";

vi.mock("@/shared/views/envVars", () => ({
  BENEFRICHES_ENV: {
    urbanProjectUsesFlowEnabled: false,
  },
}));

describe("Urban project creation - Steps - Creation mode selection", () => {
  beforeEach(() => {
    vi.mocked(BENEFRICHES_ENV).urbanProjectUsesFlowEnabled = false;
  });

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

  it("should navigate to URBAN_PROJECT_USES_INTRODUCTION when custom mode selected and uses flow enabled", () => {
    vi.mocked(BENEFRICHES_ENV).urbanProjectUsesFlowEnabled = true;

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

  it("should navigate to URBAN_PROJECT_SPACES_CATEGORIES_INTRODUCTION when custom mode selected and uses flow disabled", () => {
    vi.mocked(BENEFRICHES_ENV).urbanProjectUsesFlowEnabled = false;

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
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SPACES_CATEGORIES_INTRODUCTION");
  });

  it("should default to spaces flow when feature flag is undefined", () => {
    const store = createTestStore();

    store.dispatch(
      creationProjectFormUrbanActions.requestStepCompletion({
        stepId: "URBAN_PROJECT_CREATE_MODE_SELECTION",
        answers: {
          createMode: "custom",
        },
      }),
    );

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SPACES_CATEGORIES_INTRODUCTION");
  });
});

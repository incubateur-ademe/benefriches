import { describe, it } from "vitest";

import { ProjectFormState } from "@/shared/core/reducers/project-form/projectForm.reducer";
import { AnswersByStep } from "@/shared/core/reducers/project-form/urban-project/urbanProjectSteps";

import { confirmStepCompletion, requestStepCompletion } from "../../../urbanProject.actions";
import { createTestStore } from "../../_testStoreHelpers";

const getCurrentStep = (store: ReturnType<typeof createTestStore>) =>
  store.getState().projectCreation.urbanProject.currentStep;

describe("Urban project creation - Steps - Buildings use selection", () => {
  it("should complete step with selected buildings uses and go to URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION", () => {
    const store = createTestStore();

    store.dispatch(
      requestStepCompletion({
        stepId: "URBAN_PROJECT_BUILDINGS_USE_SELECTION",
        answers: {
          buildingsUsesSelection: ["RESIDENTIAL", "OFFICES"],
        },
      }),
    );

    expect(store.getState().projectCreation.urbanProject.steps).toEqual<
      ProjectFormState["urbanProject"]["steps"]
    >({
      URBAN_PROJECT_BUILDINGS_USE_SELECTION: {
        completed: true,
        payload: { buildingsUsesSelection: ["RESIDENTIAL", "OFFICES"] },
      },
    });
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION");
  });

  it("should assign total buildings floor surface area to selected building use and go to URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION when only one use selected", () => {
    const store = createTestStore({
      steps: {
        URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA: {
          completed: true,
          payload: { buildingsFloorSurfaceArea: 1500 },
        },
      },
    });
    const initialSteps = store.getState().projectCreation.urbanProject.steps;

    store.dispatch(
      requestStepCompletion({
        stepId: "URBAN_PROJECT_BUILDINGS_USE_SELECTION",
        answers: {
          buildingsUsesSelection: ["RESIDENTIAL"],
        },
      }),
    );

    expect(store.getState().projectCreation.urbanProject.steps).toEqual<
      ProjectFormState["urbanProject"]["steps"]
    >({
      ...initialSteps,
      URBAN_PROJECT_BUILDINGS_USE_SELECTION: {
        completed: true,
        payload: { buildingsUsesSelection: ["RESIDENTIAL"] },
      },
      URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION: {
        completed: true,
        payload: { buildingsUsesDistribution: { RESIDENTIAL: 1500 } },
      },
    });
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION");
  });

  it("should invalidate URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION step when buildings uses were changed", () => {
    const store = createTestStore({
      steps: {
        URBAN_PROJECT_BUILDINGS_USE_SELECTION: {
          completed: true,
          payload: { buildingsUsesSelection: ["RESIDENTIAL", "CULTURAL_PLACE"] },
        },
        URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION: {
          completed: true,
          payload: { buildingsUsesDistribution: { RESIDENTIAL: 1500, CULTURAL_PLACE: 1000 } },
        },
      },
    });

    const newAnswer = {
      buildingsUsesSelection: ["RESIDENTIAL", "MULTI_STORY_PARKING"],
    } satisfies AnswersByStep["URBAN_PROJECT_BUILDINGS_USE_SELECTION"];
    store.dispatch(
      requestStepCompletion({
        stepId: "URBAN_PROJECT_BUILDINGS_USE_SELECTION",
        answers: newAnswer,
      }),
    );

    expect(store.getState().projectCreation.urbanProject.pendingStepCompletion).toEqual<
      ProjectFormState["urbanProject"]["pendingStepCompletion"]
    >({
      showAlert: true,
      changes: {
        payload: {
          stepId: "URBAN_PROJECT_BUILDINGS_USE_SELECTION",
          answers: newAnswer,
        },
        cascadingChanges: [
          { action: "invalidate", stepId: "URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION" },
        ],
        navigationTarget: "URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION",
      },
    });

    store.dispatch(confirmStepCompletion());

    expect(store.getState().projectCreation.urbanProject.steps).toEqual<
      ProjectFormState["urbanProject"]["steps"]
    >({
      URBAN_PROJECT_BUILDINGS_USE_SELECTION: {
        completed: true,
        payload: newAnswer,
      },
      URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION: {
        completed: false,
      },
    });
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION");
  });
});

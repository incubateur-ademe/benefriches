import { describe, it, expect } from "vitest";

import { ProjectFormState } from "@/shared/core/reducers/project-form/projectForm.reducer";

import { creationProjectFormUrbanActions } from "../../../urbanProject.actions";
import { createTestStore, getCurrentStep } from "../../_testStoreHelpers";

describe("Urban project creation - Steps - Uses public green spaces surface area", () => {
  it("should complete step with PUBLIC_GREEN_SPACES and buildings and go to URBAN_PROJECT_USES_FLOOR_SURFACE_AREA", () => {
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
        stepId: "URBAN_PROJECT_USES_PUBLIC_GREEN_SPACES_SURFACE_AREA",
        answers: {
          publicGreenSpacesSurfaceArea: 5000,
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
      URBAN_PROJECT_USES_PUBLIC_GREEN_SPACES_SURFACE_AREA: {
        completed: true,
        payload: { publicGreenSpacesSurfaceArea: 5000 },
      },
    });
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_USES_FLOOR_SURFACE_AREA");
  });

  it("should complete step with PUBLIC_GREEN_SPACES only (no buildings) and go to URBAN_PROJECT_SPACES_INTRODUCTION", () => {
    const store = createTestStore({
      steps: {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["PUBLIC_GREEN_SPACES"] },
        },
      },
    });

    store.dispatch(
      creationProjectFormUrbanActions.requestStepCompletion({
        stepId: "URBAN_PROJECT_USES_PUBLIC_GREEN_SPACES_SURFACE_AREA",
        answers: {
          publicGreenSpacesSurfaceArea: 3000,
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
      URBAN_PROJECT_USES_PUBLIC_GREEN_SPACES_SURFACE_AREA: {
        completed: true,
        payload: { publicGreenSpacesSurfaceArea: 3000 },
      },
    });
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SPACES_INTRODUCTION");
  });

  it("should navigate to URBAN_PROJECT_USES_SELECTION when going back", () => {
    const store = createTestStore({
      currentStep: "URBAN_PROJECT_USES_PUBLIC_GREEN_SPACES_SURFACE_AREA",
      steps: {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["PUBLIC_GREEN_SPACES"] },
        },
      },
    });

    store.dispatch(creationProjectFormUrbanActions.navigateToPrevious());

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_USES_SELECTION");
  });
});

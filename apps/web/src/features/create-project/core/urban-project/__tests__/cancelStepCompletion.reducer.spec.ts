import { describe, it, expect } from "vitest";

import { ProjectCreationState } from "../../createProject.reducer";
import { creationProjectFormActions } from "../urbanProject.actions";
import { createTestStore } from "./_testStoreHelpers";

const { cancelStepCompletion, requestStepCompletion } = creationProjectFormActions;

describe("urbanProject.reducer - cancelStepCompletion action", () => {
  it("should not update state when cancelStepCompletion is used", () => {
    const initialSteps = {
      URBAN_PROJECT_SPACES_CATEGORIES_SELECTION: {
        completed: true,
        payload: { spacesCategories: ["LIVING_AND_ACTIVITY_SPACES", "GREEN_SPACES"] },
      },
      URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA: {
        completed: true,
        payload: {
          spacesCategoriesDistribution: {
            LIVING_AND_ACTIVITY_SPACES: 5000,
            GREEN_SPACES: 3000,
          },
        },
      },
      URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION: {
        completed: true,
        payload: {
          livingAndActivitySpacesDistribution: {
            BUILDINGS: 2000,
            PRIVATE_GREEN_SPACES: 3000,
          },
        },
      },
      URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA: {
        completed: true,
        payload: {
          buildingsFloorSurfaceArea: 4000,
        },
      },
      URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION: {
        completed: true,
        payload: {
          buildingsUsesDistribution: { RESIDENTIAL: 3000, LOCAL_STORE: 1000 },
        },
      },
    } satisfies ProjectCreationState["urbanProject"]["steps"];

    const store = createTestStore({
      steps: initialSteps,
      currentStep: "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION",
    });

    // Modification : suppression de LIVING_AND_ACTIVITY_SPACES
    store.dispatch(
      requestStepCompletion({
        stepId: "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION",
        answers: { spacesCategories: ["GREEN_SPACES"] },
      }),
    );
    const intermediateState = store.getState().projectCreation.urbanProject;
    expect(intermediateState.pendingStepCompletion?.showAlert).toBe(true);
    expect(intermediateState.pendingStepCompletion?.changes).toEqual({
      cascadingChanges: [
        {
          stepId: "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION",
          action: "delete",
        },
        {
          stepId: "URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA",
          action: "delete",
        },
        {
          stepId: "URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION",
          action: "delete",
        },
      ],
      navigationTarget: "URBAN_PROJECT_SPACES_DEVELOPMENT_PLAN_INTRODUCTION",
      payload: {
        answers: {
          spacesCategories: ["GREEN_SPACES"],
        },
        stepId: "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION",
      },
      shortcutComplete: [
        {
          answers: {
            spacesCategoriesDistribution: {
              GREEN_SPACES: 10000,
            },
          },
          stepId: "URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA",
        },
      ],
    });

    store.dispatch(cancelStepCompletion());

    const stepsState = store.getState().projectCreation.urbanProject.steps;

    expect(store.getState().projectCreation.urbanProject.currentStep).toEqual(
      "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION",
    );
    expect(store.getState().projectCreation.urbanProject.pendingStepCompletion).toEqual(undefined);

    expect(stepsState.URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA).toEqual(
      initialSteps.URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA,
    );
    expect(stepsState.URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION).toEqual(
      initialSteps.URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION,
    );
    expect(stepsState.URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA).toEqual(
      initialSteps.URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA,
    );
    expect(stepsState.URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION).toEqual(
      initialSteps.URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION,
    );
  });
});

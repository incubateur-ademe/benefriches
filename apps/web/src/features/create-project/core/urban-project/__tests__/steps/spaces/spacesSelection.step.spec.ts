import { describe, it, expect } from "vitest";

import { ProjectFormState } from "@/shared/core/reducers/project-form/projectForm.reducer";
import type { AnswersByStep } from "@/shared/core/reducers/project-form/urban-project/urbanProjectSteps";

import { creationProjectFormUrbanActions } from "../../../urbanProject.actions";
import { createTestStore, getCurrentStep } from "../../_testStoreHelpers";

describe("Urban project creation - Steps - Spaces selection", () => {
  it("should complete step with selected spaces and go to URBAN_PROJECT_SPACES_SURFACE_AREA", () => {
    const store = createTestStore({
      currentStep: "URBAN_PROJECT_SPACES_SELECTION",
      steps: {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL", "PUBLIC_GREEN_SPACES"] },
        },
        URBAN_PROJECT_USES_FLOOR_SURFACE_AREA: {
          completed: true,
          payload: { usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 8000 } },
        },
      },
    });

    store.dispatch(
      creationProjectFormUrbanActions.requestStepCompletion({
        stepId: "URBAN_PROJECT_SPACES_SELECTION",
        answers: {
          spacesSelection: ["BUILDINGS", "IMPERMEABLE_SOILS", "ARTIFICIAL_GRASS_OR_BUSHES_FILLED"],
        },
      }),
    );

    expect(store.getState().projectCreation.urbanProject.steps).toMatchObject({
      URBAN_PROJECT_SPACES_SELECTION: {
        completed: true,
        payload: {
          spacesSelection: ["BUILDINGS", "IMPERMEABLE_SOILS", "ARTIFICIAL_GRASS_OR_BUSHES_FILLED"],
        },
      },
    });
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SPACES_SURFACE_AREA");
  });

  it("should return previous as URBAN_PROJECT_SPACES_INTRODUCTION when no public green spaces", () => {
    const store = createTestStore({
      currentStep: "URBAN_PROJECT_SPACES_SELECTION",
      steps: {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL"] },
        },
        URBAN_PROJECT_USES_FLOOR_SURFACE_AREA: {
          completed: true,
          payload: { usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 15000 } },
        },
      },
    });

    store.dispatch(creationProjectFormUrbanActions.navigateToPrevious());

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SPACES_INTRODUCTION");
  });

  it("should return previous as URBAN_PROJECT_PUBLIC_GREEN_SPACES_SOILS_DISTRIBUTION when public green spaces selected", () => {
    const store = createTestStore({
      currentStep: "URBAN_PROJECT_SPACES_SELECTION",
      steps: {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL", "PUBLIC_GREEN_SPACES"] },
        },
        URBAN_PROJECT_USES_FLOOR_SURFACE_AREA: {
          completed: true,
          payload: { usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 8000 } },
        },
        URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA: {
          completed: true,
          payload: { publicGreenSpacesSurfaceArea: 5000 },
        },
        URBAN_PROJECT_PUBLIC_GREEN_SPACES_SOILS_DISTRIBUTION: {
          completed: true,
          payload: {
            publicGreenSpacesSoilsDistribution: {
              PRAIRIE_GRASS: 2000,
              ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 3000,
            },
          },
        },
      },
    });

    store.dispatch(creationProjectFormUrbanActions.navigateToPrevious());

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_PUBLIC_GREEN_SPACES_SOILS_DISTRIBUTION");
  });

  it("should have BUILDINGS in default answers when uses include building", () => {
    const store = createTestStore({
      steps: {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL", "PUBLIC_GREEN_SPACES"] },
        },
        URBAN_PROJECT_USES_FLOOR_SURFACE_AREA: {
          completed: true,
          payload: { usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 8000 } },
        },
      },
    });

    // Navigate to step to compute default values
    store.dispatch(
      creationProjectFormUrbanActions.navigateToStep({ stepId: "URBAN_PROJECT_SPACES_SELECTION" }),
    );

    const state = store.getState().projectCreation.urbanProject.steps;

    expect(state.URBAN_PROJECT_SPACES_SELECTION?.defaultValues).toEqual({
      spacesSelection: ["BUILDINGS"],
    });
  });

  it("should NOT have BUILDINGS in default answers when no building uses selected", () => {
    const store = createTestStore({
      steps: {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["PUBLIC_GREEN_SPACES", "OTHER_PUBLIC_SPACES"] },
        },
      },
    });

    // Navigate to step to compute default values
    store.dispatch(
      creationProjectFormUrbanActions.navigateToStep({ stepId: "URBAN_PROJECT_SPACES_SELECTION" }),
    );

    const state = store.getState().projectCreation.urbanProject.steps;

    // Only constrained soils from site should be in default (PRAIRIE_GRASS exists in mockSiteData)
    expect(state.URBAN_PROJECT_SPACES_SELECTION?.defaultValues).toEqual({
      spacesSelection: undefined,
    });
  });

  it("should delete surface area step when selection changes", () => {
    const store = createTestStore({
      currentStep: "URBAN_PROJECT_SPACES_SELECTION",
      steps: {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL"] },
        },
        URBAN_PROJECT_USES_FLOOR_SURFACE_AREA: {
          completed: true,
          payload: { usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 15000 } },
        },
        URBAN_PROJECT_SPACES_SELECTION: {
          completed: true,
          payload: { spacesSelection: ["BUILDINGS", "IMPERMEABLE_SOILS"] },
        },
        URBAN_PROJECT_SPACES_SURFACE_AREA: {
          completed: true,
          payload: {
            spacesSurfaceAreaDistribution: { BUILDINGS: 6000, IMPERMEABLE_SOILS: 4000 },
          },
        },
      },
    });

    const newAnswer = {
      spacesSelection: ["BUILDINGS", "MINERAL_SOIL"],
    } satisfies AnswersByStep["URBAN_PROJECT_SPACES_SELECTION"];

    store.dispatch(
      creationProjectFormUrbanActions.requestStepCompletion({
        stepId: "URBAN_PROJECT_SPACES_SELECTION",
        answers: newAnswer,
      }),
    );

    // Should trigger pending changes with delete rule
    expect(store.getState().projectCreation.urbanProject.pendingStepCompletion).toEqual<
      ProjectFormState["urbanProject"]["pendingStepCompletion"]
    >({
      showAlert: true,
      changes: {
        payload: {
          stepId: "URBAN_PROJECT_SPACES_SELECTION",
          answers: newAnswer,
        },
        cascadingChanges: [{ action: "delete", stepId: "URBAN_PROJECT_SPACES_SURFACE_AREA" }],
        navigationTarget: "URBAN_PROJECT_SPACES_SURFACE_AREA",
      },
    });

    store.dispatch(creationProjectFormUrbanActions.confirmStepCompletion());

    // Step is deleted - it no longer exists in state
    const surfaceAreaStep =
      store.getState().projectCreation.urbanProject.steps.URBAN_PROJECT_SPACES_SURFACE_AREA;
    expect(surfaceAreaStep).toBeUndefined();
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SPACES_SURFACE_AREA");
  });

  it("should not trigger cascading changes when spaces selection remains the same", () => {
    const store = createTestStore({
      currentStep: "URBAN_PROJECT_SPACES_SELECTION",
      steps: {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL"] },
        },
        URBAN_PROJECT_USES_FLOOR_SURFACE_AREA: {
          completed: true,
          payload: { usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 15000 } },
        },
        URBAN_PROJECT_SPACES_SELECTION: {
          completed: true,
          payload: { spacesSelection: ["BUILDINGS", "IMPERMEABLE_SOILS"] },
        },
        URBAN_PROJECT_SPACES_SURFACE_AREA: {
          completed: true,
          payload: {
            spacesSurfaceAreaDistribution: { BUILDINGS: 6000, IMPERMEABLE_SOILS: 4000 },
          },
        },
      },
    });

    store.dispatch(
      creationProjectFormUrbanActions.requestStepCompletion({
        stepId: "URBAN_PROJECT_SPACES_SELECTION",
        answers: {
          spacesSelection: ["IMPERMEABLE_SOILS", "BUILDINGS"], // Same spaces, different order
        },
      }),
    );

    // No cascading changes, direct completion
    expect(store.getState().projectCreation.urbanProject.pendingStepCompletion).toBeUndefined();
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SPACES_SURFACE_AREA");
  });
});

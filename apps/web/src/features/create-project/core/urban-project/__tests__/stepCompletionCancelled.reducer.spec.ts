import { describe, it, expect } from "vitest";

import { ProjectCreationState } from "../../createProject.reducer";
import { creationProjectFormUrbanActions } from "../urbanProject.actions";
import { StoreBuilder } from "./_testStoreHelpers";

const { stepCompletionCancelled, stepCompletionRequested } = creationProjectFormUrbanActions;

describe("urbanProject.reducer - stepCompletionCancelled action", () => {
  it("should not update state when stepCompletionCancelled is used", () => {
    const initialSteps = {
      URBAN_PROJECT_USES_SELECTION: {
        completed: true,
        payload: { usesSelection: ["RESIDENTIAL", "PUBLIC_GREEN_SPACES"] },
      },
      URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
        completed: true,
        payload: { usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 5000 } },
      },
      URBAN_PROJECT_SPACES_SURFACE_AREA: {
        completed: true,
        payload: {
          spacesSurfaceAreaDistribution: {
            BUILDINGS: 5000,
            IMPERMEABLE_SOILS: 3000,
          },
        },
      },
    } satisfies ProjectCreationState["urbanProject"]["steps"];

    const store = new StoreBuilder()
      .withSteps(initialSteps)
      .withCurrentStep("URBAN_PROJECT_USES_SELECTION")
      .build();

    // Modification: remove RESIDENTIAL from uses (triggers cascading changes on buildings)
    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_USES_SELECTION",
        answers: { usesSelection: ["PUBLIC_GREEN_SPACES"] },
      }),
    );
    const intermediateState = store.getState().projectCreation.urbanProject;
    expect(intermediateState.pendingStepCompletion?.showAlert).toBe(true);

    store.dispatch(stepCompletionCancelled());

    const stepsState = store.getState().projectCreation.urbanProject.steps;

    expect(store.getState().projectCreation.urbanProject.currentStep).toEqual(
      "URBAN_PROJECT_USES_SELECTION",
    );
    expect(store.getState().projectCreation.urbanProject.pendingStepCompletion).toEqual(undefined);

    expect(stepsState.URBAN_PROJECT_USES_SELECTION).toEqual(
      initialSteps.URBAN_PROJECT_USES_SELECTION,
    );
    expect(stepsState.URBAN_PROJECT_SPACES_SURFACE_AREA).toEqual(
      initialSteps.URBAN_PROJECT_SPACES_SURFACE_AREA,
    );
  });
});

import { describe, it, expect } from "vitest";

import { creationProjectFormUrbanActions } from "../urbanProject.actions";
import { creationProjectFormSelectors } from "../urbanProject.selectors";
import { getCurrentStep, StoreBuilder } from "./_testStoreHelpers";

const { stepCompletionCancelled, stepCompletionRequested } = creationProjectFormUrbanActions;
const { selectPendingStepCompletion, selectStepAnswers } = creationProjectFormSelectors;

describe("urbanProject.reducer - stepCompletionCancelled action", () => {
  it("keeps the current step and previous answers when a cascading change is cancelled", () => {
    const store = new StoreBuilder()
      .withSteps({
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL", "PUBLIC_GREEN_SPACES"] },
        },
        URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
          completed: true,
          payload: { usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 5000 } },
        },
      })
      .withCurrentStep("URBAN_PROJECT_USES_SELECTION")
      .build();

    // Removing RESIDENTIAL triggers a cascading change on the buildings step → awaits confirmation
    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_USES_SELECTION",
        answers: { usesSelection: ["PUBLIC_GREEN_SPACES"] },
      }),
    );
    expect(selectPendingStepCompletion(store.getState())?.showAlert).toBe(true);

    store.dispatch(stepCompletionCancelled());

    expect(selectPendingStepCompletion(store.getState())).toBeUndefined();
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_USES_SELECTION");
    expect(selectStepAnswers("URBAN_PROJECT_USES_SELECTION")(store.getState())).toEqual({
      usesSelection: ["RESIDENTIAL", "PUBLIC_GREEN_SPACES"],
    });
    expect(
      selectStepAnswers("URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA")(store.getState()),
    ).toEqual({ usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 5000 } });
  });
});

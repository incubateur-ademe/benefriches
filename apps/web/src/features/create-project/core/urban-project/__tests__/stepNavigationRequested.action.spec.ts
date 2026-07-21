import { describe, it, expect, beforeEach } from "vitest";

import { creationProjectFormUrbanActions } from "../urbanProject.actions";
import { creationProjectFormSelectors } from "../urbanProject.selectors";
import { getCurrentStep, StoreBuilder } from "./_testStoreHelpers";

const { stepNavigationRequested } = creationProjectFormUrbanActions;

describe("stepNavigationRequested action", () => {
  let store: ReturnType<StoreBuilder["build"]>;

  beforeEach(() => {
    store = new StoreBuilder().build();
  });

  it("navigates to the requested step without fabricating answers for it", () => {
    store.dispatch(stepNavigationRequested({ stepId: "URBAN_PROJECT_USES_SELECTION" }));

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_USES_SELECTION");
    const selectUsesAnswers = creationProjectFormSelectors.selectStepAnswers(
      "URBAN_PROJECT_USES_SELECTION",
    );
    expect(selectUsesAnswers(store.getState())).toBeUndefined();
  });

  it("does not overwrite existing answers when navigating to a step that already has some", () => {
    const storeWithExistingAnswer = new StoreBuilder()
      .withSteps({
        URBAN_PROJECT_NAMING: {
          completed: true,
          payload: { name: "Nom existant" },
          defaultValues: { name: "Projet PV" },
        },
      })
      .build();

    storeWithExistingAnswer.dispatch(stepNavigationRequested({ stepId: "URBAN_PROJECT_NAMING" }));

    const selectNamingAnswers =
      creationProjectFormSelectors.selectStepAnswers("URBAN_PROJECT_NAMING");
    expect(selectNamingAnswers(storeWithExistingAnswer.getState())).toEqual({
      name: "Nom existant",
    });
  });
});

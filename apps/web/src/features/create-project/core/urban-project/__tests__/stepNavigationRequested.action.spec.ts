import { describe, it, expect, beforeEach } from "vitest";

import { creationProjectFormUrbanActions } from "../urbanProject.actions";
import { StoreBuilder } from "./_testStoreHelpers";

const { stepNavigationRequested } = creationProjectFormUrbanActions;

describe("stepNavigationRequested action", () => {
  let store: ReturnType<StoreBuilder["build"]>;

  beforeEach(() => {
    store = new StoreBuilder().build();
  });

  it("should not change state when navigating to a step that has no default logic", () => {
    const initialSteps = store.getState().projectCreation.urbanProject.steps;
    expect(Object.keys(initialSteps)).toHaveLength(0);

    store.dispatch(stepNavigationRequested({ stepId: "URBAN_PROJECT_USES_SELECTION" }));

    expect(
      store.getState().projectCreation.urbanProject.steps.URBAN_PROJECT_USES_SELECTION,
    ).toBeUndefined();
  });

  it("should not overwrite existing step state when navigating to a step that already has answers", () => {
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

    expect(
      storeWithExistingAnswer.getState().projectCreation.urbanProject.steps.URBAN_PROJECT_NAMING,
    ).toEqual({
      completed: true,
      payload: { name: "Nom existant" },
      defaultValues: { name: "Projet PV" },
    });
  });
});

import { describe, it, expect } from "vitest";

import { creationProjectFormUrbanActions } from "../urbanProject.actions";
import { StoreBuilder } from "./_testStoreHelpers";

const { nextStepRequested, previousStepRequested } = creationProjectFormUrbanActions;

describe("urbanProject.reducer - Navigation Framework Tests", () => {
  describe("Bidirectional navigation consistency", () => {
    it("should handle first step correctly", () => {
      const store = new StoreBuilder().withCurrentUrbanProjectGroupStep().build();
      expect(store.getState().projectCreation.currentProjectFlow).toBe("URBAN_PROJECT");

      store.dispatch(previousStepRequested());
      const newState = store.getState().projectCreation;
      expect(newState.urbanProject.currentStep).toBe("URBAN_PROJECT_USES_INTRODUCTION");
      expect(newState.currentProjectFlow).toBe("USE_CASE_SELECTION");
    });

    it("should handle edge cases in navigation consistency", () => {
      const store = new StoreBuilder().build();

      store.dispatch(nextStepRequested());

      store.dispatch(previousStepRequested());
      expect(store.getState().projectCreation.urbanProject.currentStep).toBe(
        "URBAN_PROJECT_USES_INTRODUCTION",
      );

      store.dispatch(nextStepRequested());
      expect(store.getState().projectCreation.urbanProject.currentStep).toBe(
        "URBAN_PROJECT_USES_SELECTION",
      );
    });
  });
});

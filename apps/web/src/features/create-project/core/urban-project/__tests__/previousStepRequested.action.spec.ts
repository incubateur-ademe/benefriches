import { describe, it, expect } from "vitest";

import { creationProjectFormUrbanActions } from "../urbanProject.actions";
import { getCurrentStep, StoreBuilder } from "./_testStoreHelpers";

const { nextStepRequested, previousStepRequested } = creationProjectFormUrbanActions;

describe("urbanProject.reducer - Navigation Framework Tests", () => {
  describe("Bidirectional navigation consistency", () => {
    it("should handle first step correctly", () => {
      const store = new StoreBuilder().withCurrentUrbanProjectGroupStep().build();
      expect(store.getState().projectCreation.currentProjectFlow).toBe("URBAN_PROJECT");

      store.dispatch(previousStepRequested());
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_USES_INTRODUCTION");
      expect(store.getState().projectCreation.currentProjectFlow).toBe("USE_CASE_SELECTION");
    });

    it("should handle edge cases in navigation consistency", () => {
      const store = new StoreBuilder().build();

      store.dispatch(nextStepRequested());

      store.dispatch(previousStepRequested());
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_USES_INTRODUCTION");

      store.dispatch(nextStepRequested());
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_USES_SELECTION");
    });
  });
});

import { describe, expect, it } from "vitest";

import { StoreBuilder } from "@/features/create-project/core/urban-project/__tests__/_testStoreHelpers";
import { creationProjectFormUrbanActions } from "@/features/create-project/core/urban-project/urbanProject.actions";

describe("URBAN_PROJECT_USES_SELECTION handler", () => {
  describe("steps sequence", () => {
    it("keeps the public green spaces surface area step in the sequence when that use is selected", () => {
      const store = new StoreBuilder().build();

      store.dispatch(
        creationProjectFormUrbanActions.stepCompletionRequested({
          stepId: "URBAN_PROJECT_USES_SELECTION",
          answers: { usesSelection: ["RESIDENTIAL", "PUBLIC_GREEN_SPACES"] },
        }),
      );

      expect(store.getState().projectCreation.urbanProject.form.stepsSequence).toContain(
        "URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA",
      );
    });

    it("leaves the public green spaces surface area step out of the sequence when that use is not selected", () => {
      const store = new StoreBuilder().build();

      store.dispatch(
        creationProjectFormUrbanActions.stepCompletionRequested({
          stepId: "URBAN_PROJECT_USES_SELECTION",
          answers: { usesSelection: ["RESIDENTIAL"] },
        }),
      );

      expect(store.getState().projectCreation.urbanProject.form.stepsSequence).not.toContain(
        "URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA",
      );
    });
  });
});

import { describe, it } from "vitest";

import { navigateToNext, navigateToPrevious } from "../../../urbanProject.actions";
import { UrbanProjectState } from "../../../urbanProject.reducer";
import { createTestStore } from "../../_testStoreHelpers";

const getCurrentStep = (store: ReturnType<typeof createTestStore>) =>
  store.getState().projectCreation.urbanProject.currentStep;

describe("Urban project creation - Steps - Buildings use introduction", () => {
  it("should complete step and go to URBAN_PROJECT_BUILDINGS_USE_SELECTION", () => {
    const store = createTestStore({
      currentStep: "URBAN_PROJECT_BUILDINGS_USE_INTRODUCTION",
    });

    store.dispatch(navigateToNext());

    expect(store.getState().projectCreation.urbanProject.steps).toEqual<UrbanProjectState["steps"]>(
      {
        URBAN_PROJECT_BUILDINGS_USE_INTRODUCTION: { completed: true },
      },
    );
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_USE_SELECTION");
  });

  it("should go back to URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA", () => {
    const store = createTestStore({
      currentStep: "URBAN_PROJECT_BUILDINGS_USE_INTRODUCTION",
    });

    store.dispatch(navigateToPrevious());
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA");
  });
});

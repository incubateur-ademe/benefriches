import { describe, expect, it } from "vitest";

import { creationProjectFormUrbanActions } from "../../../urbanProject.actions";
import { StoreBuilder } from "../../_testStoreHelpers";

const { stepNavigationRequested } = creationProjectFormUrbanActions;

describe("Urban project creation - Steps - Naming", () => {
  it("should generate a default project name when navigating to the step", () => {
    // Arrange
    const store = new StoreBuilder().build();

    // Act
    store.dispatch(stepNavigationRequested({ stepId: "URBAN_PROJECT_NAMING" }));

    // Assert
    const step = store.getState().projectCreation.urbanProject.steps.URBAN_PROJECT_NAMING;
    expect(step?.defaultValues).toEqual({ name: expect.any(String) as string });
  });
});

import { DevelopmentPlanInstallationExpenses } from "shared";
import { describe, expect, it } from "vitest";

import { creationProjectFormUrbanActions } from "../../../urbanProject.actions";
import { StoreBuilder } from "../../_testStoreHelpers";

const { stepNavigationRequested, stepCompletionRequested } = creationProjectFormUrbanActions;

describe("Urban project creation - Steps - Installation expenses", () => {
  it("should populate default installation expenses when navigating to the step", () => {
    // Arrange
    const store = new StoreBuilder().build();

    // Act
    store.dispatch(stepNavigationRequested({ stepId: "URBAN_PROJECT_EXPENSES_INSTALLATION" }));

    // Assert
    const step =
      store.getState().projectCreation.urbanProject.steps.URBAN_PROJECT_EXPENSES_INSTALLATION;
    expect(step).toBeDefined();
    expect(step?.completed).toBe(false);
    expect(step?.payload).toBeUndefined();
    expect(step?.defaultValues).toMatchObject({
      installationExpenses: expect.arrayContaining([
        expect.objectContaining({ purpose: "development_works", amount: expect.any(Number) }),
        expect.objectContaining({ purpose: "technical_studies", amount: expect.any(Number) }),
        expect.objectContaining({ purpose: "other", amount: expect.any(Number) }),
      ]) as DevelopmentPlanInstallationExpenses[],
    });
  });

  it("should persist default expenses when completing the step with default values", () => {
    // Arrange
    const store = new StoreBuilder().build();
    store.dispatch(stepNavigationRequested({ stepId: "URBAN_PROJECT_EXPENSES_INSTALLATION" }));
    const defaultExpenses =
      store.getState().projectCreation.urbanProject.steps.URBAN_PROJECT_EXPENSES_INSTALLATION
        ?.defaultValues?.installationExpenses;

    // Act
    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_EXPENSES_INSTALLATION",
        answers: { installationExpenses: defaultExpenses },
      }),
    );

    // Assert
    const step =
      store.getState().projectCreation.urbanProject.steps.URBAN_PROJECT_EXPENSES_INSTALLATION;
    expect(step).toEqual({
      completed: true,
      payload: { installationExpenses: defaultExpenses },
      defaultValues: { installationExpenses: defaultExpenses },
    });
  });
});

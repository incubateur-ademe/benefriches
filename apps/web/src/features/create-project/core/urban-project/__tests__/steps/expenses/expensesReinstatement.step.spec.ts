import { ReinstatementExpense, ReinstatementExpensePurpose, sumListWithKey } from "shared";
import { describe, expect, it } from "vitest";

import { creationProjectFormUrbanActions } from "../../../urbanProject.actions";
import { StoreBuilder } from "../../_testStoreHelpers";

const { stepNavigationRequested } = creationProjectFormUrbanActions;

describe("Urban project creation - Steps - Reinstatement expenses", () => {
  it("should populate default reinstatement expenses based on soil distribution", () => {
    // Arrange
    const store = new StoreBuilder()
      .withSteps({
        URBAN_PROJECT_SPACES_SURFACE_AREA: {
          completed: true,
          payload: {
            spacesSurfaceAreaDistribution: {
              BUILDINGS: 2000,
              IMPERMEABLE_SOILS: 4000,
              MINERAL_SOIL: 2500,
              ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 1500,
            },
          },
        },
      })
      .build();

    // Act
    store.dispatch(stepNavigationRequested({ stepId: "URBAN_PROJECT_EXPENSES_REINSTATEMENT" }));

    // Assert
    const step =
      store.getState().projectCreation.urbanProject.steps.URBAN_PROJECT_EXPENSES_REINSTATEMENT;
    expect(step).toEqual({
      payload: undefined,
      completed: false,
      defaultValues: {
        reinstatementExpenses: expect.arrayContaining([
          expect.objectContaining({
            purpose: expect.any(String) as ReinstatementExpensePurpose,
            amount: expect.any(Number) as number,
          }),
        ]) as ReinstatementExpense[],
      },
    });
    const expenses = step?.defaultValues?.reinstatementExpenses ?? [];
    expect(sumListWithKey(expenses, "amount")).toBeGreaterThan(0);
  });
});

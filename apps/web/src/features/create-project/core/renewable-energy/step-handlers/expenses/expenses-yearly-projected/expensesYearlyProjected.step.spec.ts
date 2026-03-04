import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-project/core/renewable-energy/__tests__/_testStoreHelpers";
import {
  navigateToPrevious,
  requestStepCompletion,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";

describe("Renewable energy creation - Steps - expenses yearly projected", () => {
  it("should complete step and navigate to revenue introduction", () => {
    const store = new StoreBuilder().build();
    store.dispatch(
      requestStepCompletion({
        stepId: "RENEWABLE_ENERGY_EXPENSES_PROJECTED_YEARLY_EXPENSES",
        answers: { yearlyProjectedExpenses: [{ purpose: "rent", amount: 12000 }] },
      }),
    );
    expect(store.getState().projectCreation.renewableEnergyProject.steps).toMatchObject({
      RENEWABLE_ENERGY_EXPENSES_PROJECTED_YEARLY_EXPENSES: {
        completed: true,
        payload: { yearlyProjectedExpenses: [{ purpose: "rent", amount: 12000 }] },
      },
    });
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_REVENUE_INTRODUCTION");
  });

  it("should navigate back to photovoltaic panels installation", () => {
    const store = new StoreBuilder()
      .withStepsSequence([
        "RENEWABLE_ENERGY_EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION",
        "RENEWABLE_ENERGY_EXPENSES_PROJECTED_YEARLY_EXPENSES",
      ])
      .build();
    store.dispatch(navigateToPrevious());
    expect(getCurrentStep(store)).toBe(
      "RENEWABLE_ENERGY_EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION",
    );
  });
});

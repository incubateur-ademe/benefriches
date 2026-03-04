import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-project/core/renewable-energy/__tests__/_testStoreHelpers";
import {
  navigateToPrevious,
  requestStepCompletion,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";

describe("Renewable energy creation - Steps - revenue yearly projected", () => {
  it("should complete step and navigate to financial assistance", () => {
    const store = new StoreBuilder().build();
    store.dispatch(
      requestStepCompletion({
        stepId: "RENEWABLE_ENERGY_REVENUE_PROJECTED_YEARLY_REVENUE",
        answers: { yearlyProjectedRevenues: [{ source: "operations", amount: 13000 }] },
      }),
    );
    expect(
      store.getState().projectCreation.renewableEnergyProject.steps[
        "RENEWABLE_ENERGY_REVENUE_PROJECTED_YEARLY_REVENUE"
      ],
    ).toEqual({
      completed: true,
      payload: { yearlyProjectedRevenues: [{ source: "operations", amount: 13000 }] },
    });
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_REVENUE_FINANCIAL_ASSISTANCE");
  });

  it("should navigate back to revenue introduction", () => {
    const store = new StoreBuilder()
      .withStepsSequence([
        "RENEWABLE_ENERGY_REVENUE_INTRODUCTION",
        "RENEWABLE_ENERGY_REVENUE_PROJECTED_YEARLY_REVENUE",
      ])
      .build();
    store.dispatch(navigateToPrevious());
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_REVENUE_INTRODUCTION");
  });
});

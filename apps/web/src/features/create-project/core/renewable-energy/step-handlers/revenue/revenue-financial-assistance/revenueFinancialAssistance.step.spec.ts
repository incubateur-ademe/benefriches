import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-project/core/renewable-energy/__tests__/_testStoreHelpers";
import {
  navigateToPrevious,
  requestStepCompletion,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";

describe("Renewable energy creation - Steps - revenue financial assistance", () => {
  it("should complete step and navigate to schedule projection", () => {
    const store = new StoreBuilder().build();
    store.dispatch(
      requestStepCompletion({
        stepId: "RENEWABLE_ENERGY_REVENUE_FINANCIAL_ASSISTANCE",
        answers: { financialAssistanceRevenues: [] },
      }),
    );
    expect(
      store.getState().projectCreation.renewableEnergyProject.steps[
        "RENEWABLE_ENERGY_REVENUE_FINANCIAL_ASSISTANCE"
      ],
    ).toEqual({
      completed: true,
      payload: { financialAssistanceRevenues: [] },
    });
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_SCHEDULE_PROJECTION");
  });

  it("should navigate back to yearly projected revenue", () => {
    const store = new StoreBuilder()
      .withStepsSequence([
        "RENEWABLE_ENERGY_REVENUE_PROJECTED_YEARLY_REVENUE",
        "RENEWABLE_ENERGY_REVENUE_FINANCIAL_ASSISTANCE",
      ])
      .build();
    store.dispatch(navigateToPrevious());
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_REVENUE_PROJECTED_YEARLY_REVENUE");
  });
});

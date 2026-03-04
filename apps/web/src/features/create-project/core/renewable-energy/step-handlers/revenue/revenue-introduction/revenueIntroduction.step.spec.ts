import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-project/core/renewable-energy/__tests__/_testStoreHelpers";
import {
  navigateToPrevious,
  navigateToNext,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";

describe("Renewable energy creation - Steps - revenue introduction", () => {
  it("should navigate to yearly projected revenue", () => {
    const store = new StoreBuilder()
      .withStepsSequence(["RENEWABLE_ENERGY_REVENUE_INTRODUCTION"])
      .build();
    store.dispatch(navigateToNext());
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_REVENUE_PROJECTED_YEARLY_REVENUE");
  });

  it("should navigate back to yearly projected expenses", () => {
    const store = new StoreBuilder()
      .withStepsSequence([
        "RENEWABLE_ENERGY_EXPENSES_PROJECTED_YEARLY_EXPENSES",
        "RENEWABLE_ENERGY_REVENUE_INTRODUCTION",
      ])
      .build();
    store.dispatch(navigateToPrevious());
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_EXPENSES_PROJECTED_YEARLY_EXPENSES");
  });
});

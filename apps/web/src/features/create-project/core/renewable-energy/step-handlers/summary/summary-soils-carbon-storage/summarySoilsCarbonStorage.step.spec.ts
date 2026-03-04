import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-project/core/renewable-energy/__tests__/_testStoreHelpers";
import {
  navigateToPrevious,
  navigateToNext,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";

describe("Renewable energy creation - Steps - soils carbon storage", () => {
  it("should navigate to stakeholders introduction", () => {
    const store = new StoreBuilder()
      .withStepsSequence(["RENEWABLE_ENERGY_SOILS_CARBON_STORAGE"])
      .build();
    store.dispatch(navigateToNext());
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_STAKEHOLDERS_INTRODUCTION");
  });

  it("should navigate back to soils summary", () => {
    const store = new StoreBuilder()
      .withStepsSequence([
        "RENEWABLE_ENERGY_SOILS_SUMMARY",
        "RENEWABLE_ENERGY_SOILS_CARBON_STORAGE",
      ])
      .build();
    store.dispatch(navigateToPrevious());
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_SOILS_SUMMARY");
  });
});

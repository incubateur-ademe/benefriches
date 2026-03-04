import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-project/core/renewable-energy/__tests__/_testStoreHelpers";
import {
  navigateToPrevious,
  navigateToNext,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";

describe("Renewable energy creation - Steps - stakeholders introduction", () => {
  it("should navigate to stakeholders project developer", () => {
    const store = new StoreBuilder()
      .withStepsSequence(["RENEWABLE_ENERGY_STAKEHOLDERS_INTRODUCTION"])
      .build();
    store.dispatch(navigateToNext());
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_STAKEHOLDERS_PROJECT_DEVELOPER");
  });

  it("should navigate back to soils carbon storage", () => {
    const store = new StoreBuilder()
      .withStepsSequence([
        "RENEWABLE_ENERGY_SOILS_CARBON_STORAGE",
        "RENEWABLE_ENERGY_STAKEHOLDERS_INTRODUCTION",
      ])
      .build();
    store.dispatch(navigateToPrevious());
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_SOILS_CARBON_STORAGE");
  });
});

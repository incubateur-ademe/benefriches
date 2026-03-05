import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-project/core/renewable-energy/__tests__/_testStoreHelpers";
import {
  previousStepRequested,
  nextStepRequested,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";

describe("Renewable energy creation - Steps - soils carbon storage", () => {
  it("should navigate to stakeholders introduction", () => {
    const store = new StoreBuilder()
      .withStepsSequence(["RENEWABLE_ENERGY_SOILS_CARBON_STORAGE"])
      .build();
    store.dispatch(nextStepRequested());
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_STAKEHOLDERS_INTRODUCTION");
  });

  it("should navigate back to soils summary", () => {
    const store = new StoreBuilder()
      .withStepsSequence([
        "RENEWABLE_ENERGY_SOILS_SUMMARY",
        "RENEWABLE_ENERGY_SOILS_CARBON_STORAGE",
      ])
      .build();
    store.dispatch(previousStepRequested());
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_SOILS_SUMMARY");
  });
});

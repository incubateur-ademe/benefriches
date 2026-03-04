import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-project/core/renewable-energy/__tests__/_testStoreHelpers";
import {
  navigateToPrevious,
  navigateToNext,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";

describe("Renewable energy creation - Steps - soils decontamination introduction", () => {
  it("should navigate to soils decontamination selection", () => {
    const store = new StoreBuilder()
      .withStepsSequence(["RENEWABLE_ENERGY_SOILS_DECONTAMINATION_INTRODUCTION"])
      .build();
    store.dispatch(navigateToNext());
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION");
  });

  it("should navigate back to contract duration", () => {
    const store = new StoreBuilder()
      .withStepsSequence([
        "RENEWABLE_ENERGY_PHOTOVOLTAIC_CONTRACT_DURATION",
        "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_INTRODUCTION",
      ])
      .build();
    store.dispatch(navigateToPrevious());
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_PHOTOVOLTAIC_CONTRACT_DURATION");
  });
});

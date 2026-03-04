import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-project/core/renewable-energy/__tests__/_testStoreHelpers";
import {
  navigateToPrevious,
  navigateToNext,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";

describe("Renewable energy creation - Steps - non suitable soils notice", () => {
  it("should navigate to non suitable soils selection", () => {
    const store = new StoreBuilder()
      .withStepsSequence(["RENEWABLE_ENERGY_NON_SUITABLE_SOILS_NOTICE"])
      .build();
    store.dispatch(navigateToNext());
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SELECTION");
  });

  it("should navigate back to soils transformation introduction", () => {
    const store = new StoreBuilder()
      .withStepsSequence([
        "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_INTRODUCTION",
        "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_NOTICE",
      ])
      .build();
    store.dispatch(navigateToPrevious());
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_SOILS_TRANSFORMATION_INTRODUCTION");
  });
});

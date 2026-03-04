import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-project/core/renewable-energy/__tests__/_testStoreHelpers";
import {
  navigateToPrevious,
  navigateToNext,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";

describe("Renewable energy creation - Steps - soils summary", () => {
  it("should navigate to soils carbon storage", () => {
    const store = new StoreBuilder().withStepsSequence(["RENEWABLE_ENERGY_SOILS_SUMMARY"]).build();
    store.dispatch(navigateToNext());
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_SOILS_CARBON_STORAGE");
  });

  it("should navigate back to project selection when coming via non-custom path without biodiversity", () => {
    const store = new StoreBuilder()
      .withStepsSequence([
        "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION",
        "RENEWABLE_ENERGY_SOILS_SUMMARY",
      ])
      .build();
    store.dispatch(navigateToPrevious());
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION");
  });

  it("should navigate back to climate and biodiversity notice when coming via that path", () => {
    const store = new StoreBuilder()
      .withStepsSequence([
        "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CLIMATE_AND_BIODIVERSITY_IMPACT_NOTICE",
        "RENEWABLE_ENERGY_SOILS_SUMMARY",
      ])
      .build();
    store.dispatch(navigateToPrevious());
    expect(getCurrentStep(store)).toBe(
      "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CLIMATE_AND_BIODIVERSITY_IMPACT_NOTICE",
    );
  });
});

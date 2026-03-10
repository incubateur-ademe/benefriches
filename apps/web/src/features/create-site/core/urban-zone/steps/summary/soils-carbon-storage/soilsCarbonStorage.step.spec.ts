import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-site/core/urban-zone/__tests__/_testStoreHelpers";
import {
  nextStepRequested,
  previousStepRequested,
} from "@/features/create-site/core/urban-zone/urban-zone.actions";

describe("Urban zone creation - Steps - soils carbon storage", () => {
  it("should navigate to soils contamination introduction", () => {
    const store = new StoreBuilder().withCurrentStep("URBAN_ZONE_SOILS_CARBON_STORAGE").build();

    store.dispatch(nextStepRequested());

    expect(getCurrentStep(store)).toBe("URBAN_ZONE_SOILS_CONTAMINATION_INTRODUCTION");
  });

  it("should navigate back to soils summary", () => {
    const store = new StoreBuilder().withCurrentStep("URBAN_ZONE_SOILS_CARBON_STORAGE").build();

    store.dispatch(previousStepRequested());

    expect(getCurrentStep(store)).toBe("URBAN_ZONE_SOILS_SUMMARY");
  });
});

import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-site/core/urban-zone/__tests__/_testStoreHelpers";
import {
  nextStepRequested,
  previousStepRequested,
} from "@/features/create-site/core/urban-zone/urban-zone.actions";

describe("Urban zone - EXPENSES_AND_INCOME_SUMMARY step", () => {
  it("should navigate to naming introduction", () => {
    const store = new StoreBuilder()
      .withCurrentStep("URBAN_ZONE_EXPENSES_AND_INCOME_SUMMARY")
      .build();

    store.dispatch(nextStepRequested());

    expect(getCurrentStep(store)).toBe("URBAN_ZONE_NAMING_INTRODUCTION");
  });

  it("should navigate back to zone management income when has activity", () => {
    const store = new StoreBuilder()
      .withStepsSequence([
        "URBAN_ZONE_ZONE_MANAGEMENT_INCOME",
        "URBAN_ZONE_EXPENSES_AND_INCOME_SUMMARY",
      ])
      .withUrbanZoneSteps({
        URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT: {
          completed: true,
          payload: { surfaceArea: 500 },
        },
      })
      .withSiteData({ surfaceArea: 10_000 })
      .build();

    store.dispatch(previousStepRequested());

    expect(getCurrentStep(store)).toBe("URBAN_ZONE_ZONE_MANAGEMENT_INCOME");
  });

  it("should navigate back to vacant premises expenses when no activity but has vacant premises", () => {
    const store = new StoreBuilder()
      .withStepsSequence([
        "URBAN_ZONE_VACANT_PREMISES_EXPENSES",
        "URBAN_ZONE_EXPENSES_AND_INCOME_SUMMARY",
      ])
      .withUrbanZoneSteps({
        URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT: {
          completed: true,
          payload: { surfaceArea: 10_000 },
        },
      })
      .withSiteData({ surfaceArea: 10_000 })
      .build();

    store.dispatch(previousStepRequested());

    expect(getCurrentStep(store)).toBe("URBAN_ZONE_VACANT_PREMISES_EXPENSES");
  });
});

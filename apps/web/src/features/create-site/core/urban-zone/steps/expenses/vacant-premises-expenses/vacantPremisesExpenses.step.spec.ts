import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-site/core/urban-zone/__tests__/_testStoreHelpers";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-site/core/urban-zone/urban-zone.actions";

describe("Urban zone - VACANT_PREMISES_EXPENSES step", () => {
  it("should navigate to zone management expenses when site has activity", () => {
    const store = new StoreBuilder()
      .withCurrentStep("URBAN_ZONE_VACANT_PREMISES_EXPENSES")
      .withUrbanZoneSteps({
        URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT: {
          completed: true,
          payload: { surfaceArea: 500 },
        },
      })
      .withSiteData({ surfaceArea: 10_000 })
      .build();

    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_ZONE_VACANT_PREMISES_EXPENSES",
        answers: { ownerPropertyTaxes: 1000 },
      }),
    );

    expect(getCurrentStep(store)).toBe("URBAN_ZONE_ZONE_MANAGEMENT_EXPENSES");
  });

  it("should navigate to expenses summary when site has no activity (entirely vacant)", () => {
    const store = new StoreBuilder()
      .withCurrentStep("URBAN_ZONE_VACANT_PREMISES_EXPENSES")
      .withUrbanZoneSteps({
        URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT: {
          completed: true,
          payload: { surfaceArea: 10_000 },
        },
      })
      .withSiteData({ surfaceArea: 10_000 })
      .build();

    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_ZONE_VACANT_PREMISES_EXPENSES",
        answers: {},
      }),
    );

    expect(getCurrentStep(store)).toBe("URBAN_ZONE_EXPENSES_AND_INCOME_SUMMARY");
  });

  it("should navigate back to intro", () => {
    const store = new StoreBuilder()
      .withStepsSequence([
        "URBAN_ZONE_EXPENSES_AND_INCOME_INTRODUCTION",
        "URBAN_ZONE_VACANT_PREMISES_EXPENSES",
      ])
      .build();

    store.dispatch(previousStepRequested());

    expect(getCurrentStep(store)).toBe("URBAN_ZONE_EXPENSES_AND_INCOME_INTRODUCTION");
  });
});

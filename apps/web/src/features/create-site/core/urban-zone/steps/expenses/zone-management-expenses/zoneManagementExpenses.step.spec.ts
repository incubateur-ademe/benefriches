import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-site/core/urban-zone/__tests__/_testStoreHelpers";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-site/core/urban-zone/urban-zone.actions";

describe("Urban zone - ZONE_MANAGEMENT_EXPENSES step", () => {
  it("should navigate to zone management income", () => {
    const store = new StoreBuilder().withCurrentStep("URBAN_ZONE_ZONE_MANAGEMENT_EXPENSES").build();

    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_ZONE_ZONE_MANAGEMENT_EXPENSES",
        answers: { maintenance: 500 },
      }),
    );

    expect(getCurrentStep(store)).toBe("URBAN_ZONE_ZONE_MANAGEMENT_INCOME");
  });

  it("should navigate back to vacant premises expenses when has vacant premises", () => {
    const store = new StoreBuilder()
      .withStepsSequence([
        "URBAN_ZONE_VACANT_PREMISES_EXPENSES",
        "URBAN_ZONE_ZONE_MANAGEMENT_EXPENSES",
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

    expect(getCurrentStep(store)).toBe("URBAN_ZONE_VACANT_PREMISES_EXPENSES");
  });

  it("should navigate back to intro when no vacant premises", () => {
    const store = new StoreBuilder()
      .withStepsSequence([
        "URBAN_ZONE_EXPENSES_AND_INCOME_INTRODUCTION",
        "URBAN_ZONE_ZONE_MANAGEMENT_EXPENSES",
      ])
      .withUrbanZoneSteps({
        URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT: {
          completed: true,
          payload: { surfaceArea: 0 },
        },
      })
      .build();

    store.dispatch(previousStepRequested());

    expect(getCurrentStep(store)).toBe("URBAN_ZONE_EXPENSES_AND_INCOME_INTRODUCTION");
  });
});

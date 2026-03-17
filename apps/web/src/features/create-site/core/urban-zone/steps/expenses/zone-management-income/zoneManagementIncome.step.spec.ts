import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-site/core/urban-zone/__tests__/_testStoreHelpers";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-site/core/urban-zone/urban-zone.actions";

describe("Urban zone - ZONE_MANAGEMENT_INCOME step", () => {
  it("should navigate to expenses summary", () => {
    const store = new StoreBuilder().withCurrentStep("URBAN_ZONE_ZONE_MANAGEMENT_INCOME").build();

    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_ZONE_ZONE_MANAGEMENT_INCOME",
        answers: { rent: 12000 },
      }),
    );

    expect(getCurrentStep(store)).toBe("URBAN_ZONE_EXPENSES_AND_INCOME_SUMMARY");
  });

  it("should navigate back to zone management expenses", () => {
    const store = new StoreBuilder()
      .withStepsSequence([
        "URBAN_ZONE_ZONE_MANAGEMENT_EXPENSES",
        "URBAN_ZONE_ZONE_MANAGEMENT_INCOME",
      ])
      .build();

    store.dispatch(previousStepRequested());

    expect(getCurrentStep(store)).toBe("URBAN_ZONE_ZONE_MANAGEMENT_EXPENSES");
  });
});

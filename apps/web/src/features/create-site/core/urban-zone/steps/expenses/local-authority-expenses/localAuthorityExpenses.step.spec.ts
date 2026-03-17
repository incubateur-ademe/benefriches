import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-site/core/urban-zone/__tests__/_testStoreHelpers";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-site/core/urban-zone/urban-zone.actions";

describe("Urban zone - LOCAL_AUTHORITY_EXPENSES step", () => {
  it("should navigate to naming introduction", () => {
    const store = new StoreBuilder().withCurrentStep("URBAN_ZONE_LOCAL_AUTHORITY_EXPENSES").build();

    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_ZONE_LOCAL_AUTHORITY_EXPENSES",
        answers: { maintenance: 2000 },
      }),
    );

    expect(getCurrentStep(store)).toBe("URBAN_ZONE_NAMING_INTRODUCTION");
  });

  it("should navigate back to expenses introduction", () => {
    const store = new StoreBuilder()
      .withStepsSequence([
        "URBAN_ZONE_EXPENSES_AND_INCOME_INTRODUCTION",
        "URBAN_ZONE_LOCAL_AUTHORITY_EXPENSES",
      ])
      .build();

    store.dispatch(previousStepRequested());

    expect(getCurrentStep(store)).toBe("URBAN_ZONE_EXPENSES_AND_INCOME_INTRODUCTION");
  });
});

import { describe, expect, it } from "vitest";

import { StoreBuilder, expectCurrentStep } from "../../../__tests__/creation-steps/testUtils";
import { customFormActions } from "../../../custom/custom.actions";

describe("Site creation: site activity steps", () => {
  it("AGRICULTURAL_OPERATION_ACTIVITY: stores the activity and goes to ADDRESS", () => {
    const store = new StoreBuilder().withCustomStep("AGRICULTURAL_OPERATION_ACTIVITY").build();

    store.dispatch(
      customFormActions.stepCompletionRequested({
        stepId: "AGRICULTURAL_OPERATION_ACTIVITY",
        answers: { activity: "LARGE_VEGETABLE_CULTIVATION" },
      }),
    );

    expectCurrentStep(store, "ADDRESS");
    expect(
      store.getState().siteCreation.custom.steps.AGRICULTURAL_OPERATION_ACTIVITY?.payload,
    ).toEqual({ activity: "LARGE_VEGETABLE_CULTIVATION" });
  });

  it("NATURAL_AREA_TYPE: stores the type and goes to ADDRESS", () => {
    const store = new StoreBuilder().withCustomStep("NATURAL_AREA_TYPE").build();

    store.dispatch(
      customFormActions.stepCompletionRequested({
        stepId: "NATURAL_AREA_TYPE",
        answers: { naturalAreaType: "PRAIRIE" },
      }),
    );

    expectCurrentStep(store, "ADDRESS");
    expect(store.getState().siteCreation.custom.steps.NATURAL_AREA_TYPE?.payload).toEqual({
      naturalAreaType: "PRAIRIE",
    });
  });

  it("FRICHE_ACTIVITY: stores the activity and goes to ADDRESS", () => {
    const store = new StoreBuilder().withCustomStep("FRICHE_ACTIVITY").build();

    store.dispatch(
      customFormActions.stepCompletionRequested({
        stepId: "FRICHE_ACTIVITY",
        answers: "INDUSTRY",
      }),
    );

    expectCurrentStep(store, "ADDRESS");
    expect(store.getState().siteCreation.custom.steps.FRICHE_ACTIVITY?.payload).toEqual("INDUSTRY");
  });

  it("FRICHE_ACTIVITY: going back leaves the custom engine (first step of the branch)", () => {
    const store = new StoreBuilder().withCustomStep("FRICHE_ACTIVITY").build();

    store.dispatch(customFormActions.previousStepRequested());

    expect(store.getState().siteCreation.customFlowStarted).toBe(false);
  });
});

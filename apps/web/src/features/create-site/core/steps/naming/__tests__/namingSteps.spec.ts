import { describe, expect, it } from "vitest";

import { StoreBuilder, expectCurrentStep } from "../../../__tests__/creation-steps/testUtils";
import { customFormActions } from "../../../custom/custom.actions";

describe("Site creation: naming steps", () => {
  it("NAMING_INTRODUCTION: goes to NAMING", () => {
    const store = new StoreBuilder().withCustomStep("NAMING_INTRODUCTION").build();

    store.dispatch(customFormActions.nextStepRequested());

    expectCurrentStep(store, "NAMING");
  });

  it("NAMING: stores name and description, goes to FINAL_SUMMARY", () => {
    const store = new StoreBuilder().withCustomStep("NAMING").build();

    store.dispatch(
      customFormActions.stepCompletionRequested({
        stepId: "NAMING",
        answers: { name: "Friche Blajan", description: "Une friche" },
      }),
    );

    expectCurrentStep(store, "FINAL_SUMMARY");
    expect(store.getState().siteCreation.custom.steps.NAMING?.payload).toEqual({
      name: "Friche Blajan",
      description: "Une friche",
    });
  });

  it("NAMING: omits the description when none is given", () => {
    const store = new StoreBuilder().withCustomStep("NAMING").build();

    store.dispatch(
      customFormActions.stepCompletionRequested({
        stepId: "NAMING",
        answers: { name: "Friche Blajan" },
      }),
    );

    expect(store.getState().siteCreation.custom.steps.NAMING?.payload).toEqual({
      name: "Friche Blajan",
    });
  });
});

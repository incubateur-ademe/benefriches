import { describe, expect, it } from "vitest";

import { StoreBuilder, expectCurrentStep } from "../../../__tests__/creation-steps/testUtils";
import { customFormActions } from "../../../custom/custom.actions";

describe("Site creation: contamination and accidents steps", () => {
  it("SOILS_CONTAMINATION: keeps the contaminated surface only when contaminated, goes to FRICHE_ACCIDENTS_INTRODUCTION", () => {
    const store = new StoreBuilder().withCustomStep("SOILS_CONTAMINATION").build();

    store.dispatch(
      customFormActions.stepCompletionRequested({
        stepId: "SOILS_CONTAMINATION",
        answers: { hasContaminatedSoils: false, contaminatedSoilSurface: 500 },
      }),
    );

    expectCurrentStep(store, "FRICHE_ACCIDENTS_INTRODUCTION");
    expect(store.getState().siteCreation.custom.steps.SOILS_CONTAMINATION?.payload).toEqual({
      hasContaminatedSoils: false,
    });
  });

  it("FRICHE_ACCIDENTS: zero-fills missing injury counts when accidents occurred, goes to MANAGEMENT_INTRODUCTION", () => {
    const store = new StoreBuilder().withCustomStep("FRICHE_ACCIDENTS").build();

    store.dispatch(
      customFormActions.stepCompletionRequested({
        stepId: "FRICHE_ACCIDENTS",
        answers: { hasRecentAccidents: true },
      }),
    );

    expectCurrentStep(store, "MANAGEMENT_INTRODUCTION");
    expect(store.getState().siteCreation.custom.steps.FRICHE_ACCIDENTS?.payload).toEqual({
      hasRecentAccidents: true,
      accidentsMinorInjuries: 0,
      accidentsSevereInjuries: 0,
      accidentsDeaths: 0,
    });
  });

  it("FRICHE_ACCIDENTS: stores no injury counts when no accidents occurred", () => {
    const store = new StoreBuilder().withCustomStep("FRICHE_ACCIDENTS").build();

    store.dispatch(
      customFormActions.stepCompletionRequested({
        stepId: "FRICHE_ACCIDENTS",
        answers: { hasRecentAccidents: false },
      }),
    );

    expect(store.getState().siteCreation.custom.steps.FRICHE_ACCIDENTS?.payload).toEqual({
      hasRecentAccidents: false,
    });
  });
});

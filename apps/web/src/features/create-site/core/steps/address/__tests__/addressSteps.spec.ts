import { Address } from "shared";
import { describe, expect, it } from "vitest";

import { StoreBuilder, expectCurrentStep } from "../../../__tests__/creation-steps/testUtils";
import { customFormActions } from "../../../custom/custom.actions";

const ADDRESS: Address = {
  banId: "31070_p4ur8e",
  value: "Sendere 31350 Blajan",
  city: "Blajan",
  cityCode: "31070",
  postCode: "31350",
  streetName: "Sendere",
  long: 0.664699,
  lat: 43.260859,
};

describe("Site creation: address step", () => {
  it("goes to SPACES_INTRODUCTION for a non urban-zone nature", () => {
    const store = new StoreBuilder().withCustomStep("ADDRESS").build();

    store.dispatch(
      customFormActions.stepCompletionRequested({
        stepId: "ADDRESS",
        answers: { address: ADDRESS },
      }),
    );

    expectCurrentStep(store, "SPACES_INTRODUCTION");
    expect(store.getState().siteCreation.custom.steps.ADDRESS?.payload).toEqual({
      address: ADDRESS,
    });
  });

  it("goes to URBAN_ZONE_LAND_PARCELS_INTRODUCTION for an urban-zone nature", () => {
    const store = new StoreBuilder().withNature("URBAN_ZONE").withCustomStep("ADDRESS").build();

    store.dispatch(
      customFormActions.stepCompletionRequested({
        stepId: "ADDRESS",
        answers: { address: ADDRESS },
      }),
    );

    expectCurrentStep(store, "URBAN_ZONE_LAND_PARCELS_INTRODUCTION");
  });
});

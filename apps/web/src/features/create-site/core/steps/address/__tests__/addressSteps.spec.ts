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

// Different city than ADDRESS.
const GRENOBLE_ADDRESS: Address = {
  banId: "38185_0490",
  value: "Rue de Bonne 38000 Grenoble",
  city: "Grenoble",
  cityCode: "38185",
  postCode: "38000",
  streetName: "Rue de Bonne",
  long: 5.724524,
  lat: 45.188529,
};

// Same city as ADDRESS, different street/banId.
const ADDRESS_OTHER_STREET: Address = {
  ...ADDRESS,
  banId: "31070_other",
  streetName: "Autre rue",
  value: "Autre rue 31350 Blajan",
};

const OWNER_LOCAL_AUTHORITY = {
  completed: true,
  payload: { owner: { structureType: "municipality" as const, name: "Mairie de Blajan" } },
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

  it("parks the change and asks for confirmation when the city changes and OWNER is a completed local authority", () => {
    const store = new StoreBuilder()
      .withCustomStep("ADDRESS", {
        ADDRESS: { completed: true, payload: { address: ADDRESS } },
        OWNER: OWNER_LOCAL_AUTHORITY,
      })
      .build();

    store.dispatch(
      customFormActions.stepCompletionRequested({
        stepId: "ADDRESS",
        answers: { address: GRENOBLE_ADDRESS },
      }),
    );

    const { custom } = store.getState().siteCreation;
    expect(custom.pendingStepCompletion?.showAlert).toBe(true);
    expect(custom.pendingStepCompletion?.changes.cascadingChanges).toEqual([
      { stepId: "OWNER", action: "invalidate" },
    ]);
    expectCurrentStep(store, "ADDRESS");
    expect(custom.steps.ADDRESS?.payload).toEqual({ address: ADDRESS });
  });

  it("leaves every answer untouched when the cascade is cancelled", () => {
    const store = new StoreBuilder()
      .withCustomStep("ADDRESS", {
        ADDRESS: { completed: true, payload: { address: ADDRESS } },
        OWNER: OWNER_LOCAL_AUTHORITY,
      })
      .build();

    store.dispatch(
      customFormActions.stepCompletionRequested({
        stepId: "ADDRESS",
        answers: { address: GRENOBLE_ADDRESS },
      }),
    );
    store.dispatch(customFormActions.stepCompletionCancelled());

    const { custom } = store.getState().siteCreation;
    expect(custom.pendingStepCompletion).toBeUndefined();
    expect(custom.steps.ADDRESS?.payload).toEqual({ address: ADDRESS });
    expect(custom.steps.OWNER).toEqual(OWNER_LOCAL_AUTHORITY);
  });

  it("applies the new address and clears the invalidated OWNER answer when the cascade is confirmed", () => {
    const store = new StoreBuilder()
      .withCustomStep("ADDRESS", {
        ADDRESS: { completed: true, payload: { address: ADDRESS } },
        OWNER: OWNER_LOCAL_AUTHORITY,
      })
      .build();

    store.dispatch(
      customFormActions.stepCompletionRequested({
        stepId: "ADDRESS",
        answers: { address: GRENOBLE_ADDRESS },
      }),
    );
    store.dispatch(customFormActions.stepCompletionConfirmed());

    const { custom } = store.getState().siteCreation;
    expect(custom.steps.ADDRESS?.payload).toEqual({ address: GRENOBLE_ADDRESS });
    expect(custom.steps.OWNER).toEqual({
      completed: false,
      payload: undefined,
      defaultValues: undefined,
    });
    expect(custom.pendingStepCompletion).toBeUndefined();
    expectCurrentStep(store, "SPACES_INTRODUCTION");
  });

  it("triggers no cascade and applies immediately when the address is re-validated for the same city", () => {
    const store = new StoreBuilder()
      .withCustomStep("ADDRESS", {
        ADDRESS: { completed: true, payload: { address: ADDRESS } },
        OWNER: OWNER_LOCAL_AUTHORITY,
      })
      .build();

    store.dispatch(
      customFormActions.stepCompletionRequested({
        stepId: "ADDRESS",
        answers: { address: ADDRESS_OTHER_STREET },
      }),
    );

    const { custom } = store.getState().siteCreation;
    expect(custom.pendingStepCompletion).toBeUndefined();
    expect(custom.steps.OWNER?.completed).toBe(true);
    expectCurrentStep(store, "SPACES_INTRODUCTION");
  });
});

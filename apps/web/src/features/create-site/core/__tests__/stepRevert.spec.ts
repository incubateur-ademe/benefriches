import {
  isFricheCompleted,
  isFricheReverted,
  siteNatureReverted,
} from "../actions/introduction.actions";
import { stepRevertCancelled, stepRevertConfirmed } from "../actions/revert.actions";
import { selectShouldConfirmStepRevert } from "../selectors/createSite.selectors";
import { expectCurrentStep, StoreBuilder } from "./creation-steps/testUtils";

describe("Site creation: step revert confirmation logic", () => {
  it("does nothing when user reverted one step", () => {
    const store = new StoreBuilder()
      .withStepsHistory(["INTRODUCTION", "IS_FRICHE", "SITE_NATURE"])
      .build();

    store.dispatch(siteNatureReverted());

    expect(selectShouldConfirmStepRevert(store.getState())).toBe(false);
    expectCurrentStep(store.getState(), "IS_FRICHE");
  });

  it("does nothing when user reverted one step, then completed one and reverted again", () => {
    const store = new StoreBuilder()
      .withStepsHistory(["INTRODUCTION", "IS_FRICHE", "SITE_NATURE"])
      .build();

    // revert current step
    store.dispatch(siteNatureReverted());
    expect(selectShouldConfirmStepRevert(store.getState())).toBe(false);
    expectCurrentStep(store.getState(), "IS_FRICHE");

    // complete step
    store.dispatch(isFricheCompleted({ isFriche: false }));
    expect(selectShouldConfirmStepRevert(store.getState())).toBe(false);
    expectCurrentStep(store.getState(), "SITE_NATURE");

    // revert again
    store.dispatch(siteNatureReverted());
    expect(selectShouldConfirmStepRevert(store.getState())).toBe(false);
    expectCurrentStep(store.getState(), "IS_FRICHE");
  });

  it("shows warning when user reverted two steps in a row and does not perform second revert", () => {
    const store = new StoreBuilder()
      .withStepsHistory(["INTRODUCTION", "IS_FRICHE", "SITE_NATURE"])
      .build();

    // revert current step
    store.dispatch(siteNatureReverted());
    expect(selectShouldConfirmStepRevert(store.getState())).toBe(false);
    expectCurrentStep(store.getState(), "IS_FRICHE");

    // revert current step
    store.dispatch(isFricheReverted());
    expect(selectShouldConfirmStepRevert(store.getState())).toBe(true);
    expectCurrentStep(store.getState(), "IS_FRICHE");
  });

  it("should not perform revert action and hide warning when user chooses to cancel revert action", async () => {
    const store = new StoreBuilder()
      .withStepsHistory(["INTRODUCTION", "IS_FRICHE", "SITE_NATURE"])
      .build();

    // revert current step
    store.dispatch(siteNatureReverted());
    expect(selectShouldConfirmStepRevert(store.getState())).toBe(false);
    expectCurrentStep(store.getState(), "IS_FRICHE");

    // revert current step
    store.dispatch(isFricheReverted());
    expect(selectShouldConfirmStepRevert(store.getState())).toBe(true);
    expectCurrentStep(store.getState(), "IS_FRICHE");

    store.dispatch(stepRevertCancelled());
    // wait for the next tick to ensure async flow in listener is done
    await new Promise((resolve) => setTimeout(resolve, 0));
    expectCurrentStep(store.getState(), "IS_FRICHE");
    expect(selectShouldConfirmStepRevert(store.getState())).toBe(false);
    expect(store.getState().siteCreation.consecutiveStepsReverted).toBe(0);
  });

  it("should perform revert action and hide display warning when user chooses to confirm revert action", async () => {
    const store = new StoreBuilder()
      .withStepsHistory(["INTRODUCTION", "IS_FRICHE", "SITE_NATURE"])
      .withCreationData({ nature: "AGRICULTURAL_OPERATION", isFriche: false })
      .build();

    // revert current step
    store.dispatch(siteNatureReverted());
    expect(selectShouldConfirmStepRevert(store.getState())).toBe(false);
    expectCurrentStep(store.getState(), "IS_FRICHE");
    expect(store.getState().siteCreation.siteData.nature).toBe(undefined);

    // revert current step
    store.dispatch(isFricheReverted());
    expect(selectShouldConfirmStepRevert(store.getState())).toBe(true);
    expectCurrentStep(store.getState(), "IS_FRICHE");
    expect(store.getState().siteCreation.siteData.isFriche).toBe(false);

    store.dispatch(stepRevertConfirmed());
    // wait for the next tick to ensure async flow in listener is done
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(store.getState().siteCreation.siteData.isFriche).toBe(undefined);
    expectCurrentStep(store.getState(), "INTRODUCTION");
    expect(selectShouldConfirmStepRevert(store.getState())).toBe(false);
    expect(store.getState().siteCreation.consecutiveStepsReverted).toBe(0);
  });
});

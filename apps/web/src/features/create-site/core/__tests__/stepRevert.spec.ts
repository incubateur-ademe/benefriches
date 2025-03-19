import {
  addressStepReverted,
  agriculturalOperationActivityReverted,
  isFricheCompleted,
  isFricheReverted,
  siteNatureReverted,
} from "../actions/introduction.actions";
import { stepRevertCancelled, stepRevertConfirmed } from "../actions/revert.actions";
import { selectShouldConfirmStepRevert } from "../selectors/createSite.selectors";
import { expectCurrentStep, StoreBuilder } from "./creation-steps/testUtils";

describe("Site creation: step revert confirmation logic", () => {
  describe("when user has disabled confirmation on step revert", () => {
    it("lets user revert steps", () => {
      const store = new StoreBuilder()
        .withStepRevertConfirmation(false)
        .withStepsHistory(["INTRODUCTION", "IS_FRICHE", "SITE_NATURE", "ADDRESS"])
        .build();

      store.dispatch(addressStepReverted());
      store.dispatch(siteNatureReverted());
      store.dispatch(isFricheReverted());

      expect(selectShouldConfirmStepRevert(store.getState())).toBe(false);
      expectCurrentStep(store.getState(), "INTRODUCTION");
    });
  });

  describe("with step revert confirmation enabled", () => {
    const getStore = () => new StoreBuilder().withStepRevertConfirmation(true);

    it("lets user revert one step", () => {
      const store = getStore()
        .withStepsHistory(["INTRODUCTION", "IS_FRICHE", "SITE_NATURE"])
        .build();

      store.dispatch(siteNatureReverted());

      expect(selectShouldConfirmStepRevert(store.getState())).toBe(false);
      expectCurrentStep(store.getState(), "IS_FRICHE");
    });

    it("does nothing when user reverted one step, then completed one and reverted again", () => {
      const store = getStore()
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
      const store = getStore()
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

    it("asks for confirmation and then does not perform step revert when user cancels", async () => {
      const store = getStore()
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

      store.dispatch(stepRevertCancelled({ doNotAskAgain: false }));
      // wait for the next tick to ensure async flow in listener is done
      await new Promise((resolve) => setTimeout(resolve, 0));
      expectCurrentStep(store.getState(), "IS_FRICHE");
      expect(selectShouldConfirmStepRevert(store.getState())).toBe(false);
      expect(store.getState().siteCreation.consecutiveStepsReverted).toBe(0);
    });

    it("asks for confirmation and then does not perform step revert when user confirms", async () => {
      const store = getStore()
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

      store.dispatch(stepRevertConfirmed({ doNotAskAgain: false }));
      // wait for the next tick to ensure async flow in listener is done
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(store.getState().siteCreation.siteData.isFriche).toBe(undefined);
      expectCurrentStep(store.getState(), "INTRODUCTION");
      expect(selectShouldConfirmStepRevert(store.getState())).toBe(false);
      expect(store.getState().siteCreation.consecutiveStepsReverted).toBe(0);
    });

    it("will not ask again for confirmation when user has confirmed revert and doesn't want to be asked again", async () => {
      const store = getStore()
        .withStepsHistory([
          "INTRODUCTION",
          "IS_FRICHE",
          "SITE_NATURE",
          "ADDRESS",
          "AGRICULTURAL_OPERATION_ACTIVITY",
        ])
        .withCreationData({ nature: "AGRICULTURAL_OPERATION", isFriche: false })
        .build();

      store.dispatch(agriculturalOperationActivityReverted());
      expect(selectShouldConfirmStepRevert(store.getState())).toBe(false);
      store.dispatch(addressStepReverted());
      expect(selectShouldConfirmStepRevert(store.getState())).toBe(true);

      // confirm and do not ask again
      expect(store.getState().appSettings.askForConfirmationOnStepRevert).toBe(true);
      store.dispatch(stepRevertConfirmed({ doNotAskAgain: true }));
      expect(store.getState().appSettings.askForConfirmationOnStepRevert).toBe(false);
      // wait for the next tick to ensure async flow in listener is done
      await new Promise((resolve) => setTimeout(resolve, 0));

      // revert again
      store.dispatch(siteNatureReverted());
      expect(selectShouldConfirmStepRevert(store.getState())).toBe(false);
      store.dispatch(isFricheReverted());

      // user should not be asked for confirmation again
      expect(selectShouldConfirmStepRevert(store.getState())).toBe(false);
      expectCurrentStep(store.getState(), "INTRODUCTION");
    });
  });
});

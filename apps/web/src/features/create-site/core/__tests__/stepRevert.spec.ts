import { createStore } from "@/shared/core/store-config/store";

import {
  addressStepReverted,
  agriculturalOperationActivityReverted,
  isFricheReverted,
  siteNatureReverted,
} from "../actions/introduction.actions";
import { stepRevertCancelled, stepRevertConfirmed } from "../actions/revert.actions";
import { selectShouldConfirmStepRevert } from "../selectors/createSite.selectors";
import { expectCurrentStep, StoreBuilder } from "./creation-steps/testUtils";

const expectConfirmationAsked = (store: ReturnType<typeof createStore>) => {
  return expect(selectShouldConfirmStepRevert(store.getState()));
};

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

      expectConfirmationAsked(store).toBe(false);
      expectCurrentStep(store.getState(), "INTRODUCTION");
    });
  });

  describe("with step revert confirmation enabled", () => {
    const getStore = () => new StoreBuilder().withStepRevertConfirmation(true);

    it("asks for confirmation when user reverts step", () => {
      const store = getStore()
        .withStepsHistory(["INTRODUCTION", "IS_FRICHE", "SITE_NATURE"])
        .build();

      // revert current step
      store.dispatch(siteNatureReverted());
      expectConfirmationAsked(store).toBe(true);
      // revert was not performed
      expectCurrentStep(store.getState(), "SITE_NATURE");
    });

    it("asks for confirmation and then does not perform step revert when user cancels", async () => {
      const store = getStore()
        .withStepsHistory(["INTRODUCTION", "IS_FRICHE", "SITE_NATURE"])
        .build();

      // revert current step
      store.dispatch(siteNatureReverted());
      expectConfirmationAsked(store).toBe(true);
      expectCurrentStep(store.getState(), "SITE_NATURE");

      store.dispatch(stepRevertCancelled({ doNotAskAgain: false }));
      // wait for the next tick to ensure async flow in listener is done
      await new Promise((resolve) => setTimeout(resolve, 0));

      // revert was not performed
      expectCurrentStep(store.getState(), "SITE_NATURE");
      expectConfirmationAsked(store).toBe(false);
    });

    it("asks for confirmation and then perform step revert when user confirms", async () => {
      const store = getStore()
        .withStepsHistory(["INTRODUCTION", "IS_FRICHE", "SITE_NATURE"])
        .withCreationData({ nature: "AGRICULTURAL_OPERATION", isFriche: false })
        .build();

      // revert current step
      store.dispatch(siteNatureReverted());
      expectConfirmationAsked(store).toBe(true);
      // make sure revert was not performed
      expectCurrentStep(store.getState(), "SITE_NATURE");
      expect(store.getState().siteCreation.siteData.nature).toBe("AGRICULTURAL_OPERATION");

      store.dispatch(stepRevertConfirmed({ doNotAskAgain: false }));
      // wait for the next tick to ensure async flow in listener is done
      await new Promise((resolve) => setTimeout(resolve, 0));
      // revert should have been performed
      expectConfirmationAsked(store).toBe(false);
      expect(store.getState().siteCreation.siteData.nature).toBe(undefined);
      expectCurrentStep(store.getState(), "IS_FRICHE");
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
      expectConfirmationAsked(store).toBe(true);

      // confirm and do not ask again
      expect(store.getState().appSettings.askForConfirmationOnStepRevert).toBe(true);
      store.dispatch(stepRevertConfirmed({ doNotAskAgain: true }));
      expect(store.getState().appSettings.askForConfirmationOnStepRevert).toBe(false);
      // wait for the next tick to ensure async flow in listener is done
      await new Promise((resolve) => setTimeout(resolve, 0));

      // revert again
      store.dispatch(addressStepReverted());
      // user should not be asked for confirmation again
      expectConfirmationAsked(store).toBe(false);
      // step should have been reverted
      expectCurrentStep(store.getState(), "SITE_NATURE");
    });
  });
});

import {
  expectNewCurrentStep,
  expectSiteDataDiff,
  expectStepReverted,
  StoreBuilder,
} from "../../../__tests__/creation-steps/testUtils";
import { stepReverted } from "../../../actions/revert.action";
import { siteWithExhaustiveData } from "../../../siteData.mock";
import { addressStepCompleted } from "../address.actions";

describe("Site creation: address step", () => {
  describe("ADDRESS", () => {
    describe("complete", () => {
      it("goes to SPACES_INTRODUCTION step and sets address when step is completed", () => {
        const store = new StoreBuilder().withStepsHistory(["ADDRESS"]).build();
        const initialRootState = store.getState();

        store.dispatch(addressStepCompleted({ address: siteWithExhaustiveData.address }));

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, {
          address: siteWithExhaustiveData.address,
        });
        expectNewCurrentStep(initialRootState, newState, "SPACES_INTRODUCTION");
      });
    });
    describe("revert", () => {
      it("goes to previous step and unset address data", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["IS_FRICHE", "ADDRESS"])
          .withCreationData({ isFriche: true, address: siteWithExhaustiveData.address })
          .build();
        const initialRootState = store.getState();

        store.dispatch(stepReverted());

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, { address: undefined });
        expectStepReverted(initialRootState, newState);
      });
    });
  });
});

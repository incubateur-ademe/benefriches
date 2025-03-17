import { revertNamingStep } from "../../actions/createSite.actions";
import { completeNaming, namingIntroductionStepCompleted } from "../../createSite.reducer";
import { siteWithExhaustiveData } from "../../siteData.mock";
import {
  expectNewCurrentStep,
  expectSiteDataDiff,
  expectSiteDataUnchanged,
  expectStepReverted,
  StoreBuilder,
} from "./testUtils";

describe("Site creation: naming steps", () => {
  describe("NAMING_INTRODUCTION", () => {
    describe("complete", () => {
      it("goes to NAMING step when completed", () => {
        const store = new StoreBuilder().withStepsHistory(["NAMING_INTRODUCTION"]).build();
        const initialRootState = store.getState();

        store.dispatch(namingIntroductionStepCompleted());

        const newState = store.getState();
        expectSiteDataUnchanged(initialRootState, newState);
        expectNewCurrentStep(initialRootState, newState, "NAMING");
      });
    });
  });
  describe("NAMING", () => {
    describe("complete", () => {
      it("goes to FINAL_SUMMARY step and sets name and description when step is completed", () => {
        const store = new StoreBuilder().withStepsHistory(["NAMING"]).build();
        const initialRootState = store.getState();

        const { name, description } = siteWithExhaustiveData;
        store.dispatch(completeNaming({ name, description }));

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, {
          name,
          description,
        });
        expectNewCurrentStep(initialRootState, newState, "FINAL_SUMMARY");
      });
    });
    describe("revert", () => {
      it("goes to previous step and unset naming", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["IS_FRICHE", "ADDRESS", "NAMING"])
          .withCreationData({ isFriche: true, name: "site 1", description: "blabla" })
          .build();
        const initialRootState = store.getState();

        store.dispatch(revertNamingStep());

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, {
          name: undefined,
          description: undefined,
        });
        expectStepReverted(initialRootState, newState);
      });
    });
  });
});

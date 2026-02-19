import {
  expectNewCurrentStep,
  expectSiteDataDiff,
  expectStepReverted,
  StoreBuilder,
} from "../../../__tests__/creation-steps/testUtils";
import { stepReverted } from "../../../actions/revert.action";
import {
  agriculturalOperationActivityCompleted,
  fricheActivityStepCompleted,
  naturalAreaTypeCompleted,
} from "../siteActivity.actions";

describe("Site creation: site activity steps", () => {
  describe("AGRICULTURAL_OPERATION_ACTIVITY", () => {
    it("goes to ADDRESS step when completed", () => {
      const store = new StoreBuilder()
        .withStepsHistory(["AGRICULTURAL_OPERATION_ACTIVITY"])
        .withCreationData({
          isFriche: false,
          nature: "AGRICULTURAL_OPERATION",
        })
        .build();

      const initialRootState = store.getState();

      store.dispatch(
        agriculturalOperationActivityCompleted({ activity: "LARGE_VEGETABLE_CULTIVATION" }),
      );

      const newState = store.getState();
      expectNewCurrentStep(initialRootState, newState, "ADDRESS");
      expectSiteDataDiff(initialRootState, newState, {
        agriculturalOperationActivity: "LARGE_VEGETABLE_CULTIVATION",
      });
    });
    it("goes to previous step and unsets agricultural operation activity when reverted", () => {
      const store = new StoreBuilder()
        .withStepsHistory(["CREATE_MODE_SELECTION", "AGRICULTURAL_OPERATION_ACTIVITY"])
        .withCreationData({
          isFriche: false,
          nature: "AGRICULTURAL_OPERATION",
          agriculturalOperationActivity: "CATTLE_FARMING",
        })
        .build();

      const initialRootState = store.getState();

      store.dispatch(stepReverted());

      const newState = store.getState();
      expectStepReverted(initialRootState, newState);
      expectSiteDataDiff(initialRootState, newState, {
        agriculturalOperationActivity: undefined,
      });
    });
  });
  describe("NATURAL_AREA_TYPE", () => {
    it("goes to ADDRESS step when completed", () => {
      const store = new StoreBuilder()
        .withStepsHistory(["NATURAL_AREA_TYPE"])
        .withCreationData({
          isFriche: false,
          nature: "NATURAL_AREA",
        })
        .build();

      const initialRootState = store.getState();

      store.dispatch(naturalAreaTypeCompleted({ naturalAreaType: "PRAIRIE" }));

      const newState = store.getState();
      expectNewCurrentStep(initialRootState, newState, "ADDRESS");
      expectSiteDataDiff(initialRootState, newState, {
        naturalAreaType: "PRAIRIE",
      });
    });
    it("goes to previous step and unsets agricultural operation activity when reverted", () => {
      const store = new StoreBuilder()
        .withStepsHistory(["CREATE_MODE_SELECTION", "NATURAL_AREA_TYPE"])
        .withCreationData({
          isFriche: false,
          nature: "AGRICULTURAL_OPERATION",
          naturalAreaType: "PRAIRIE",
        })
        .build();

      const initialRootState = store.getState();

      store.dispatch(stepReverted());

      const newState = store.getState();
      expectStepReverted(initialRootState, newState);
      expectSiteDataDiff(initialRootState, newState, {
        naturalAreaType: undefined,
      });
    });
  });
  describe("FRICHE_ACTIVITY", () => {
    describe("complete", () => {
      it("goes to ADDRESS step and sets friche activity when step is completed", () => {
        const store = new StoreBuilder().withStepsHistory(["FRICHE_ACTIVITY"]).build();
        const initialRootState = store.getState();

        store.dispatch(fricheActivityStepCompleted("INDUSTRY"));

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, {
          fricheActivity: "INDUSTRY",
        });
        expectNewCurrentStep(initialRootState, newState, "ADDRESS");
      });
    });
    describe("revert", () => {
      it("goes to previous step and unset friche activity", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["IS_FRICHE", "FRICHE_ACTIVITY"])
          .withCreationData({
            isFriche: true,
            fricheActivity: "BUILDING",
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(stepReverted());

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, {
          fricheActivity: undefined,
        });
        expectStepReverted(initialRootState, newState);
      });
    });
  });
});

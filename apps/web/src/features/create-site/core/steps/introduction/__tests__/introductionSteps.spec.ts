import {
  expectNewCurrentStep,
  expectSiteDataDiff,
  expectSiteDataUnchanged,
  expectStepReverted,
  StoreBuilder,
} from "../../../__tests__/creation-steps/testUtils";
import { stepReverted } from "../../../actions/revert.action";
import {
  createModeSelectionCompleted,
  introductionStepCompleted,
  isFricheCompleted,
  siteCreationInitiated,
  siteNatureCompleted,
  mutabilityOrImpactsSelectionCompleted,
} from "../introduction.actions";

describe("Site creation: introduction steps (intro, nature, creation mode)", () => {
  describe("initial state", () => {
    it("starts with CREATE_MODE_SELECTION step", () => {
      const store = new StoreBuilder().build();

      store.dispatch(siteCreationInitiated());

      expect(store.getState().siteCreation.stepsHistory).toEqual(["CREATE_MODE_SELECTION"]);
    });

    it("starts with IS_FRICHE step when asked to skip intro", () => {
      const store = new StoreBuilder().build();

      store.dispatch(siteCreationInitiated({ skipIntroduction: true }));

      expect(store.getState().siteCreation.stepsHistory).toEqual(["IS_FRICHE"]);
    });

    it("sets true to skipUseMutability in store", () => {
      const store = new StoreBuilder().build();

      store.dispatch(siteCreationInitiated({ skipIntroduction: true, skipUseMutability: true }));

      expect(store.getState().siteCreation.skipUseMutability).toEqual(true);
    });
  });

  describe("CREATE_MODE_SELECTION", () => {
    it("goes to INTRODUCTION step when custom mode is selected", () => {
      const store = new StoreBuilder().withStepsHistory(["CREATE_MODE_SELECTION"]).build();

      const initialRootState = store.getState();

      store.dispatch(createModeSelectionCompleted({ createMode: "custom" }));

      const newState = store.getState();
      expectNewCurrentStep(initialRootState, newState, "INTRODUCTION");
    });

    it("goes to DEMO_INTRODUCTION step when express mode is selected", () => {
      const store = new StoreBuilder().withStepsHistory(["CREATE_MODE_SELECTION"]).build();

      store.dispatch(createModeSelectionCompleted({ createMode: "express" }));

      const newState = store.getState();
      expect(newState.siteCreation.createMode).toEqual("express");
      expect(newState.siteCreation.demo.currentStep).toEqual("DEMO_INTRODUCTION");
    });
  });

  describe("INTRODUCTION", () => {
    it("goes to IS_FRICHE step when step completed", () => {
      const store = new StoreBuilder().withStepsHistory(["INTRODUCTION"]).build();
      const initialRootState = store.getState();

      store.dispatch(introductionStepCompleted());

      const newState = store.getState();
      expectSiteDataUnchanged(initialRootState, newState);
      expectNewCurrentStep(initialRootState, newState, "IS_FRICHE");
    });
  });
  describe("IS_FRICHE", () => {
    it("goes to SITE_NATURE step when step is completed and site is not a friche", () => {
      const store = new StoreBuilder().withStepsHistory(["INTRODUCTION", "IS_FRICHE"]).build();
      const initialRootState = store.getState();

      store.dispatch(isFricheCompleted({ isFriche: false }));

      const newState = store.getState();
      expectSiteDataDiff(initialRootState, newState, { isFriche: false });
      expectNewCurrentStep(initialRootState, newState, "SITE_NATURE");
    });
    it("goes to USE_MUTABILITY step and sets site nature to friche when step is completed and site is a friche", () => {
      const store = new StoreBuilder().withStepsHistory(["INTRODUCTION", "IS_FRICHE"]).build();
      const initialRootState = store.getState();

      store.dispatch(isFricheCompleted({ isFriche: true }));

      const newState = store.getState();
      expectSiteDataDiff(initialRootState, newState, { isFriche: true, nature: "FRICHE" });
      expectNewCurrentStep(initialRootState, newState, "USE_MUTABILITY");
    });
    it("goes to FRICHE_ACTIVITY step and sets site nature to friche when step is completed and site is a friche but skipUseMutability is true", () => {
      const store = new StoreBuilder()
        .withSkipUseMutability(true)
        .withStepsHistory(["INTRODUCTION", "IS_FRICHE"])
        .build();
      const initialRootState = store.getState();

      store.dispatch(isFricheCompleted({ isFriche: true }));

      const newState = store.getState();
      expectSiteDataDiff(initialRootState, newState, { isFriche: true, nature: "FRICHE" });
      expectNewCurrentStep(initialRootState, newState, "FRICHE_ACTIVITY");
    });
    it("goes to previous step and unsets isFriche when step is reverted", () => {
      const store = new StoreBuilder().withStepsHistory(["INTRODUCTION", "IS_FRICHE"]).build();
      const initialRootState = store.getState();

      store.dispatch(stepReverted());

      const newState = store.getState();
      expectSiteDataDiff(initialRootState, newState, { isFriche: undefined });
      expectStepReverted(initialRootState, newState);
    });
  });
  describe("USE_MUTABILITY", () => {
    it("goes to FRICHE_ACTIVITY step when step is completed with useMutability false", () => {
      const store = new StoreBuilder().withStepsHistory(["INTRODUCTION", "IS_FRICHE"]).build();
      const initialRootState = store.getState();

      store.dispatch(mutabilityOrImpactsSelectionCompleted({ useMutability: false }));

      const newState = store.getState();
      expectNewCurrentStep(initialRootState, newState, "FRICHE_ACTIVITY");
    });
    it("goes to previous step when step is reverted", () => {
      const store = new StoreBuilder().withStepsHistory(["INTRODUCTION", "USE_MUTABILITY"]).build();
      const initialRootState = store.getState();

      store.dispatch(stepReverted());

      const newState = store.getState();
      expectStepReverted(initialRootState, newState);
    });
  });
  describe("SITE_NATURE", () => {
    it("goes to FRICHE_ACTIVITY step when completed", () => {
      const store = new StoreBuilder().withStepsHistory(["SITE_NATURE"]).build();
      const initialRootState = store.getState();

      store.dispatch(siteNatureCompleted({ nature: "FRICHE" }));

      const newState = store.getState();
      expectSiteDataDiff(initialRootState, newState, { nature: "FRICHE" });
      expectNewCurrentStep(initialRootState, newState, "FRICHE_ACTIVITY");
    });

    it("goes to AGRICULTURAL_OPERATION_ACTIVITY step when completed", () => {
      const store = new StoreBuilder().withStepsHistory(["SITE_NATURE"]).build();
      const initialRootState = store.getState();

      store.dispatch(siteNatureCompleted({ nature: "AGRICULTURAL_OPERATION" }));

      const newState = store.getState();
      expectNewCurrentStep(initialRootState, newState, "AGRICULTURAL_OPERATION_ACTIVITY");
    });
    it("goes to NATURAL_AREA_TYPE step when completed", () => {
      const store = new StoreBuilder()
        .withStepsHistory(["INTRODUCTION", "CREATE_MODE_SELECTION"])
        .build();
      const initialRootState = store.getState();

      store.dispatch(siteNatureCompleted({ nature: "NATURAL_AREA" }));

      const newState = store.getState();
      expectNewCurrentStep(initialRootState, newState, "NATURAL_AREA_TYPE");
    });

    it("goes to previous step and unsets site nature when step is reverted", () => {
      const store = new StoreBuilder()
        .withCreationData({
          nature: "NATURAL_AREA",
        })
        .withStepsHistory(["IS_FRICHE", "SITE_NATURE"])
        .build();
      const initialRootState = store.getState();

      store.dispatch(stepReverted());

      const newState = store.getState();
      expectSiteDataDiff(initialRootState, newState, { nature: undefined });
      expectStepReverted(initialRootState, newState);
    });
  });
});

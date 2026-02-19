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
    it("starts with INTRODUCTION step", () => {
      const store = new StoreBuilder().build();

      store.dispatch(siteCreationInitiated());

      expect(store.getState().siteCreation.stepsHistory).toEqual(["INTRODUCTION"]);
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
    it("goes to CREATE_MODE_SELECTION step and sets site nature to friche when step is completed and site is a friche but skipUseMutability is true", () => {
      const store = new StoreBuilder()
        .withSkipUseMutability(true)
        .withStepsHistory(["INTRODUCTION", "IS_FRICHE"])
        .build();
      const initialRootState = store.getState();

      store.dispatch(isFricheCompleted({ isFriche: true }));

      const newState = store.getState();
      expectSiteDataDiff(initialRootState, newState, { isFriche: true, nature: "FRICHE" });
      expectNewCurrentStep(initialRootState, newState, "CREATE_MODE_SELECTION");
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
    it("goes to CREATION_MODE_SELECTION step when step is completed with useMutability false", () => {
      const store = new StoreBuilder().withStepsHistory(["INTRODUCTION", "IS_FRICHE"]).build();
      const initialRootState = store.getState();

      store.dispatch(mutabilityOrImpactsSelectionCompleted({ useMutability: false }));

      const newState = store.getState();
      expectNewCurrentStep(initialRootState, newState, "CREATE_MODE_SELECTION");
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
    it("goes to CREATE_MODE_SELECTION step when completed", () => {
      const store = new StoreBuilder().withStepsHistory(["SITE_NATURE"]).build();
      const initialRootState = store.getState();

      store.dispatch(siteNatureCompleted({ nature: "AGRICULTURAL_OPERATION" }));

      const newState = store.getState();
      expectSiteDataDiff(initialRootState, newState, { nature: "AGRICULTURAL_OPERATION" });
      expectNewCurrentStep(initialRootState, newState, "CREATE_MODE_SELECTION");
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
  describe("CREATE_MODE_SELECTION", () => {
    it.each(["express", "custom"] as const)(
      "goes to FRICHE_ACTIVITY step when '%s' mode is selected and site is a friche",
      (creationMode) => {
        const store = new StoreBuilder()
          .withStepsHistory(["INTRODUCTION", "CREATE_MODE_SELECTION"])
          .withCreationData({
            isFriche: true,
            nature: "FRICHE",
          })
          .build();

        const initialRootState = store.getState();

        store.dispatch(createModeSelectionCompleted({ createMode: creationMode }));

        const newState = store.getState();
        expectNewCurrentStep(initialRootState, newState, "FRICHE_ACTIVITY");
      },
    );
    it.each(["express", "custom"] as const)(
      "goes to AGRICULTURAL_OPERATION_ACTIVITY step when '%s' mode is selected and site is agricultural operation",
      (creationMode) => {
        const store = new StoreBuilder()
          .withStepsHistory(["INTRODUCTION", "CREATE_MODE_SELECTION"])
          .withCreationData({
            isFriche: false,
            nature: "AGRICULTURAL_OPERATION",
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(createModeSelectionCompleted({ createMode: creationMode }));

        const newState = store.getState();
        expectNewCurrentStep(initialRootState, newState, "AGRICULTURAL_OPERATION_ACTIVITY");
      },
    );
    it.each(["express", "custom"] as const)(
      "goes to NATURAL_AREA_TYPE step when '%s' mode is selected and site is natural area",
      (creationMode) => {
        const store = new StoreBuilder()
          .withStepsHistory(["INTRODUCTION", "CREATE_MODE_SELECTION"])
          .withCreationData({
            isFriche: false,
            nature: "NATURAL_AREA",
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(createModeSelectionCompleted({ createMode: creationMode }));

        const newState = store.getState();
        expectNewCurrentStep(initialRootState, newState, "NATURAL_AREA_TYPE");
      },
    );
  });
});

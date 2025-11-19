import {
  agriculturalOperationActivityCompleted,
  createModeSelectionCompleted,
  fricheActivityStepCompleted,
  introductionStepCompleted,
  isFricheCompleted,
  naturalAreaTypeCompleted,
  siteNatureCompleted,
  addressStepCompleted,
  siteCreationInitiated,
  useMutabilityCompleted,
} from "../../actions/introduction.actions";
import { stepRevertAttempted } from "../../actions/revert.actions";
import { siteWithExhaustiveData } from "../../siteData.mock";
import {
  expectNewCurrentStep,
  expectSiteDataDiff,
  expectSiteDataUnchanged,
  expectStepReverted,
  StoreBuilder,
} from "./testUtils";

describe("Site creation: introduction steps (intro, nature, creation mode, address)", () => {
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
    it("goes to previous step and unsets isFriche when step is reverted", () => {
      const store = new StoreBuilder().withStepsHistory(["INTRODUCTION", "IS_FRICHE"]).build();
      const initialRootState = store.getState();

      store.dispatch(stepRevertAttempted());

      const newState = store.getState();
      expectSiteDataDiff(initialRootState, newState, { isFriche: undefined });
      expectStepReverted(initialRootState, newState);
    });
  });
  describe("USE_MUTABILITY", () => {
    it("goes to CREATION_MODE_SELECTION step when step is completed with useMutability false", () => {
      const store = new StoreBuilder().withStepsHistory(["INTRODUCTION", "IS_FRICHE"]).build();
      const initialRootState = store.getState();

      store.dispatch(useMutabilityCompleted({ useMutability: false }));

      const newState = store.getState();
      expectNewCurrentStep(initialRootState, newState, "CREATE_MODE_SELECTION");
    });
    it("goes to previous step when step is reverted", () => {
      const store = new StoreBuilder().withStepsHistory(["INTRODUCTION", "USE_MUTABILITY"]).build();
      const initialRootState = store.getState();

      store.dispatch(stepRevertAttempted());

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

      store.dispatch(stepRevertAttempted());

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

      store.dispatch(stepRevertAttempted());

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

      store.dispatch(stepRevertAttempted());

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

        store.dispatch(stepRevertAttempted());

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, {
          fricheActivity: undefined,
        });
        expectStepReverted(initialRootState, newState);
      });
    });
  });
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

        store.dispatch(stepRevertAttempted());

        const newState = store.getState();
        expectSiteDataDiff(initialRootState, newState, { address: undefined });
        expectStepReverted(initialRootState, newState);
      });
    });
  });
});

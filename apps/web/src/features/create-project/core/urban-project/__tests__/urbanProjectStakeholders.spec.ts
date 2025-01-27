import {
  stakeholderIntroductionCompleted,
  stakeholderIntroductionReverted,
  stakeholderProjectDeveloperCompleted,
  stakeholderProjectDeveloperReverted,
  stakeholderReinstatementContractOwnerCompleted,
  stakeholderReinstatementContractOwnerReverted,
} from "../actions/urbanProject.actions";
import {
  expectCurrentStep,
  expectUpdatedState,
  expectRevertedState,
  StoreBuilder,
} from "./testUtils";

describe("Urban project creation : stakeholders steps", () => {
  describe("Custom creation mode", () => {
    describe("STAKEHOLDERS_INTRODUCTION step", () => {
      it("goes to STAKEHOLDERS_PROJECT_DEVELOPER step when step is completed", () => {
        const store = new StoreBuilder().withStepsHistory(["STAKEHOLDERS_INTRODUCTION"]).build();
        const initialRootState = store.getState();

        store.dispatch(stakeholderIntroductionCompleted());

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "STAKEHOLDERS_PROJECT_DEVELOPER",
        });
      });

      it("goes to previous step when step is reverted", () => {
        const store = new StoreBuilder()
          .withStepsHistory([
            "BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION",
            "STAKEHOLDERS_INTRODUCTION",
          ])
          .build();

        store.dispatch(stakeholderIntroductionReverted());

        const newState = store.getState();
        expectCurrentStep(newState, "BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION");
      });
    });
    describe("STAKEHOLDERS_PROJECT_DEVELOPER step", () => {
      it("goes to STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER step and sets projectDeveloper when step is completed and site is friche", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["STAKEHOLDERS_INTRODUCTION", "STAKEHOLDERS_PROJECT_DEVELOPER"])
          .withSiteData({ isFriche: true })
          .build();
        const initialRootState = store.getState();

        store.dispatch(
          stakeholderProjectDeveloperCompleted({
            structureType: "municipality",
            name: "Mairie d’angers",
          }),
        );
        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER",
          creationDataDiff: {
            projectDeveloper: { structureType: "municipality", name: "Mairie d’angers" },
          },
        });
      });
      it("goes to SITE_RESALE_INTRODUCTION step when step is completed and site is not friche", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["STAKEHOLDERS_PROJECT_DEVELOPER"])
          .build();
        const initialRootState = store.getState();

        store.dispatch(
          stakeholderProjectDeveloperCompleted({
            structureType: "municipality",
            name: "Mairie d’angers",
          }),
        );

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "SITE_RESALE_INTRODUCTION",
          creationDataDiff: {
            projectDeveloper: { structureType: "municipality", name: "Mairie d’angers" },
          },
        });
      });
      it("goes to previous step and unset projectDeveloper when step is reverted", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["STAKEHOLDERS_INTRODUCTION", "STAKEHOLDERS_PROJECT_DEVELOPER"])
          .withCreationData({
            projectDeveloper: { structureType: "municipality", name: "Mairie d’angers" },
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(stakeholderProjectDeveloperReverted());

        const newState = store.getState();
        expectRevertedState(initialRootState, newState, {
          creationDataDiff: {
            projectDeveloper: undefined,
          },
        });
      });
    });
    describe("STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER step", () => {
      it("goes to SITE_RESALE_INTRODUCTION step and sets reinstatementContractOwner when step is completed", () => {
        const store = new StoreBuilder()
          .withStepsHistory([
            "STAKEHOLDERS_PROJECT_DEVELOPER",
            "STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER",
          ])
          .build();
        const initialRootState = store.getState();

        store.dispatch(
          stakeholderReinstatementContractOwnerCompleted({
            structureType: "municipality",
            name: "Mairie d’angers",
          }),
        );

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "SITE_RESALE_INTRODUCTION",
          creationDataDiff: {
            reinstatementContractOwner: { structureType: "municipality", name: "Mairie d’angers" },
          },
        });
      });
      it("goes to previous step and unset reinstatementContractOwner when step is reverted", () => {
        const store = new StoreBuilder()
          .withStepsHistory([
            "STAKEHOLDERS_PROJECT_DEVELOPER",
            "STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER",
          ])
          .withCreationData({
            reinstatementContractOwner: { structureType: "municipality", name: "Mairie d’angers" },
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(stakeholderReinstatementContractOwnerReverted());

        const newState = store.getState();
        expectRevertedState(initialRootState, newState, {
          creationDataDiff: {
            reinstatementContractOwner: undefined,
          },
        });
      });
    });
  });
});

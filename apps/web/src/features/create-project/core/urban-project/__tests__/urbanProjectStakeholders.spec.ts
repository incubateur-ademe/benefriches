import { stepRevertAttempted } from "../../actions/actionsUtils";
import {
  stakeholderIntroductionCompleted,
  stakeholderProjectDeveloperCompleted,
  stakeholderReinstatementContractOwnerCompleted,
} from "../actions/urbanProject.actions";
import {
  expectCurrentStep,
  expectUpdatedState,
  expectRevertedState,
  StoreBuilder,
} from "./testUtils";

describe("Urban project creation : stakeholders steps", () => {
  describe("Custom creation mode", () => {
    describe("URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION step", () => {
      it("goes to URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER step when step is completed", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION"])
          .build();
        const initialRootState = store.getState();

        store.dispatch(stakeholderIntroductionCompleted());

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER",
        });
      });

      it("goes to previous step when step is reverted", () => {
        const store = new StoreBuilder()
          .withStepsHistory([
            "URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION",
            "URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION",
          ])
          .build();

        store.dispatch(stepRevertAttempted());

        const newState = store.getState();
        expectCurrentStep(newState, "URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION");
      });
    });
    describe("URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER step", () => {
      it("goes to URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER step and sets projectDeveloper when step is completed and site is friche", () => {
        const store = new StoreBuilder()
          .withStepsHistory([
            "URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION",
            "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER",
          ])
          .withSiteData({ nature: "FRICHE" })
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
          currentStep: "URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER",
          creationDataDiff: {
            projectDeveloper: { structureType: "municipality", name: "Mairie d’angers" },
          },
        });
      });
      it("goes to URBAN_PROJECT_SITE_RESALE_INTRODUCTION step when step is completed and site is not friche", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER"])
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
          currentStep: "URBAN_PROJECT_SITE_RESALE_INTRODUCTION",
          creationDataDiff: {
            projectDeveloper: { structureType: "municipality", name: "Mairie d’angers" },
          },
        });
      });
      it("goes to previous step and unset projectDeveloper when step is reverted", () => {
        const store = new StoreBuilder()
          .withStepsHistory([
            "URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION",
            "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER",
          ])
          .withCreationData({
            projectDeveloper: { structureType: "municipality", name: "Mairie d’angers" },
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(stepRevertAttempted());

        const newState = store.getState();
        expectRevertedState(initialRootState, newState, {
          creationDataDiff: {
            projectDeveloper: undefined,
          },
        });
      });
    });
    describe("URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER step", () => {
      it("goes to URBAN_PROJECT_SITE_RESALE_INTRODUCTION step and sets reinstatementContractOwner when step is completed", () => {
        const store = new StoreBuilder()
          .withStepsHistory([
            "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER",
            "URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER",
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
          currentStep: "URBAN_PROJECT_SITE_RESALE_INTRODUCTION",
          creationDataDiff: {
            reinstatementContractOwner: { structureType: "municipality", name: "Mairie d’angers" },
          },
        });
      });
      it("goes to previous step and unset reinstatementContractOwner when step is reverted", () => {
        const store = new StoreBuilder()
          .withStepsHistory([
            "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER",
            "URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER",
          ])
          .withCreationData({
            reinstatementContractOwner: { structureType: "municipality", name: "Mairie d’angers" },
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(stepRevertAttempted());

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

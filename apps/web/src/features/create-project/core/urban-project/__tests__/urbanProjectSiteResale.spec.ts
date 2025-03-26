import { stepRevertAttempted } from "../../actions/actionsUtils";
import "../actions/urbanProject.actions";
import {
  buildingsResaleChoiceCompleted,
  siteResaleChoiceCompleted,
  siteResaleIntroductionCompleted,
} from "../actions/urbanProject.actions";
import { expectUpdatedState, expectRevertedState, StoreBuilder } from "./testUtils";

describe("Urban project creation : site resale steps", () => {
  describe("Custom creation mode", () => {
    describe("URBAN_PROJECT_SITE_RESALE_INTRODUCTION step", () => {
      it("goes to URBAN_PROJECT_SITE_RESALE_SELECTION step when step is completed", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["URBAN_PROJECT_SITE_RESALE_INTRODUCTION"])
          .build();
        const initialRootState = store.getState();

        store.dispatch(siteResaleIntroductionCompleted());

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "URBAN_PROJECT_SITE_RESALE_SELECTION",
        });
      });

      it("goes to previous step when step is reverted", () => {
        const store = new StoreBuilder()
          .withStepsHistory([
            "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER",
            "URBAN_PROJECT_SITE_RESALE_INTRODUCTION",
          ])
          .build();
        const initialRootState = store.getState();

        store.dispatch(stepRevertAttempted());

        expectRevertedState(initialRootState, store.getState(), {});
      });
    });

    describe("URBAN_PROJECT_SITE_RESALE_SELECTION step", () => {
      it("goes to URBAN_PROJECT_EXPENSES_INTRODUCTION and set current owner as future owner when no site resale planned and urban project doesn't have buildings", () => {
        const store = new StoreBuilder()
          .withSiteData({
            owner: {
              name: "Propriétaire de la friche",
              structureType: "municipality",
            },
          })
          .withStepsHistory([
            "URBAN_PROJECT_SITE_RESALE_INTRODUCTION",
            "URBAN_PROJECT_SITE_RESALE_SELECTION",
          ])
          .build();
        const initialRootState = store.getState();

        store.dispatch(siteResaleChoiceCompleted({ siteResalePlannedAfterDevelopment: false }));

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "URBAN_PROJECT_EXPENSES_INTRODUCTION",
          creationDataDiff: {
            siteResalePlannedAfterDevelopment: false,
            futureSiteOwner: { name: "Propriétaire de la friche", structureType: "municipality" },
          },
        });
      });
      it("goes to URBAN_PROJECT_EXPENSES_INTRODUCTION and set future owner as unknown when site resale planned and urban project doesn't have buildings", () => {
        const store = new StoreBuilder()
          .withSiteData({
            owner: {
              name: "Propriétaire de la friche",
              structureType: "municipality",
            },
          })
          .withStepsHistory([
            "URBAN_PROJECT_SITE_RESALE_INTRODUCTION",
            "URBAN_PROJECT_SITE_RESALE_SELECTION",
          ])
          .build();
        const initialRootState = store.getState();

        store.dispatch(siteResaleChoiceCompleted({ siteResalePlannedAfterDevelopment: true }));

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "URBAN_PROJECT_EXPENSES_INTRODUCTION",
          creationDataDiff: {
            siteResalePlannedAfterDevelopment: true,
            futureSiteOwner: { name: "Futur propriétaire inconnu", structureType: "unknown" },
          },
        });
      });
      it("goes to URBAN_PROJECT_BUILDINGS_RESALE_SELECTION and set site resale choice when step is completed and urban project has buildings", () => {
        const store = new StoreBuilder()
          .withStepsHistory([
            "URBAN_PROJECT_SITE_RESALE_INTRODUCTION",
            "URBAN_PROJECT_SITE_RESALE_SELECTION",
          ])
          .withCreationData({
            livingAndActivitySpacesDistribution: {
              BUILDINGS: 1000,
              PAVED_ALLEY_OR_PARKING_LOT: 3400,
            },
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(siteResaleChoiceCompleted({ siteResalePlannedAfterDevelopment: true }));

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION",
          creationDataDiff: {
            futureSiteOwner: {
              name: "Futur propriétaire inconnu",
              structureType: "unknown",
            },
            siteResalePlannedAfterDevelopment: true,
          },
        });
      });
      it("goes to previous step and unsets site resale choice and future owner when step is reverted", () => {
        const store = new StoreBuilder()
          .withStepsHistory([
            "URBAN_PROJECT_SITE_RESALE_INTRODUCTION",
            "URBAN_PROJECT_SITE_RESALE_SELECTION",
          ])
          .withCreationData({
            siteResalePlannedAfterDevelopment: false,
            futureSiteOwner: {
              name: "Aménageur",
              structureType: "company",
            },
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(stepRevertAttempted());

        const newState = store.getState();
        expectRevertedState(initialRootState, newState, {
          creationDataDiff: {
            siteResalePlannedAfterDevelopment: undefined,
            futureSiteOwner: undefined,
          },
        });
      });
    });
    describe("URBAN_PROJECT_BUILDINGS_RESALE_SELECTION step", () => {
      it("goes to URBAN_PROJECT_EXPENSES_INTRODUCTION and set project developer as future operator when no buildings resale planned when step is completed", () => {
        const store = new StoreBuilder()
          .withCreationData({
            projectDeveloper: {
              name: "Mairie d'Angers",
              structureType: "municipality",
            },
          })
          .withStepsHistory([
            "URBAN_PROJECT_SITE_RESALE_INTRODUCTION",
            "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION",
          ])
          .build();
        const initialRootState = store.getState();

        store.dispatch(
          buildingsResaleChoiceCompleted({ buildingsResalePlannedAfterDevelopment: false }),
        );

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "URBAN_PROJECT_EXPENSES_INTRODUCTION",
          creationDataDiff: {
            buildingsResalePlannedAfterDevelopment: false,
            futureOperator: {
              name: "Mairie d'Angers",
              structureType: "municipality",
            },
          },
        });
      });
      it("goes to URBAN_PROJECT_EXPENSES_INTRODUCTION and set unknown future operator when buildings resale planned when step is completed", () => {
        const store = new StoreBuilder()
          .withCreationData({
            projectDeveloper: {
              name: "Mairie d'Angers",
              structureType: "municipality",
            },
          })
          .withStepsHistory([
            "URBAN_PROJECT_SITE_RESALE_INTRODUCTION",
            "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION",
          ])
          .build();
        const initialRootState = store.getState();

        store.dispatch(
          buildingsResaleChoiceCompleted({ buildingsResalePlannedAfterDevelopment: true }),
        );

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "URBAN_PROJECT_EXPENSES_INTRODUCTION",
          creationDataDiff: {
            buildingsResalePlannedAfterDevelopment: true,
            futureOperator: {
              name: "Futur exploitant inconnu",
              structureType: "unknown",
            },
          },
        });
      });
      it("goes to previous step and unsets buildings resale choice and future operator when step is reverted", () => {
        const store = new StoreBuilder()
          .withStepsHistory([
            "URBAN_PROJECT_SITE_RESALE_SELECTION",
            "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION",
          ])
          .withCreationData({
            buildingsResalePlannedAfterDevelopment: true,
            futureOperator: {
              name: "Futur exploitant inconnu",
              structureType: "unknown",
            },
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(stepRevertAttempted());

        const newState = store.getState();
        expectRevertedState(initialRootState, newState, {
          creationDataDiff: {
            buildingsResalePlannedAfterDevelopment: undefined,
            futureOperator: undefined,
          },
        });
      });
    });
  });
});

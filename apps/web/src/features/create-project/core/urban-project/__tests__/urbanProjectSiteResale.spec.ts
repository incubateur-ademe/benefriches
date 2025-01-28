import "../actions/urbanProject.actions";
import {
  buildingsResaleChoiceCompleted,
  buildingsResaleChoiceReverted,
  siteResaleChoiceCompleted,
  siteResaleChoiceReverted,
  siteResaleIntroductionCompleted,
  siteResaleIntroductionReverted,
} from "../actions/urbanProject.actions";
import { expectUpdatedState, expectRevertedState, StoreBuilder } from "./testUtils";

describe("Urban project creation : site resale steps", () => {
  describe("Custom creation mode", () => {
    describe("SITE_RESALE_INTRODUCTION step", () => {
      it("goes to SITE_RESALE_SELECTION step when step is completed", () => {
        const store = new StoreBuilder().withStepsHistory(["SITE_RESALE_INTRODUCTION"]).build();
        const initialRootState = store.getState();

        store.dispatch(siteResaleIntroductionCompleted());

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "SITE_RESALE_SELECTION",
        });
      });

      it("goes to previous step when step is reverted", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["STAKEHOLDERS_PROJECT_DEVELOPER", "SITE_RESALE_INTRODUCTION"])
          .build();
        const initialRootState = store.getState();

        store.dispatch(siteResaleIntroductionReverted());

        expectRevertedState(initialRootState, store.getState(), {});
      });
    });

    describe("SITE_RESALE_SELECTION step", () => {
      it("goes to EXPENSES_INTRODUCTION and set site resale choice when step is completed and urban project doesn't have buildings", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["SITE_RESALE_INTRODUCTION", "SITE_RESALE_SELECTION"])
          .build();
        const initialRootState = store.getState();

        store.dispatch(siteResaleChoiceCompleted({ siteResalePlannedAfterDevelopment: true }));

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "EXPENSES_INTRODUCTION",
          creationDataDiff: {
            siteResalePlannedAfterDevelopment: true,
          },
        });
      });
      it("goes to BUILDINGS_RESALE_SELECTION and set site resale choice when step is completed and urban project has buildings", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["SITE_RESALE_INTRODUCTION", "SITE_RESALE_SELECTION"])
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
          currentStep: "BUILDINGS_RESALE_SELECTION",
          creationDataDiff: {
            siteResalePlannedAfterDevelopment: true,
          },
        });
      });
      it("goes to previous step and unsets site resale choice when step is reverted", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["SITE_RESALE_INTRODUCTION", "SITE_RESALE_SELECTION"])
          .withCreationData({
            siteResalePlannedAfterDevelopment: false,
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(siteResaleChoiceReverted());

        const newState = store.getState();
        expectRevertedState(initialRootState, newState, {
          creationDataDiff: {
            siteResalePlannedAfterDevelopment: undefined,
          },
        });
      });
    });
    describe("BUILDINGS_RESALE_SELECTION step", () => {
      it("goes to EXPENSES_INTRODUCTION and set buildings resale choice when step is completed", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["SITE_RESALE_INTRODUCTION", "BUILDINGS_RESALE_SELECTION"])
          .build();
        const initialRootState = store.getState();

        store.dispatch(
          buildingsResaleChoiceCompleted({ buildingsResalePlannedAfterDevelopment: true }),
        );

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "EXPENSES_INTRODUCTION",
          creationDataDiff: {
            buildingsResalePlannedAfterDevelopment: true,
          },
        });
      });
      it("goes to previous step and unsets buildings resale choice when step is reverted", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["SITE_RESALE_SELECTION", "BUILDINGS_RESALE_SELECTION"])
          .withCreationData({
            buildingsResalePlannedAfterDevelopment: true,
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(buildingsResaleChoiceReverted());

        const newState = store.getState();
        expectRevertedState(initialRootState, newState, {
          creationDataDiff: {
            buildingsResalePlannedAfterDevelopment: undefined,
          },
        });
      });
    });
  });
});

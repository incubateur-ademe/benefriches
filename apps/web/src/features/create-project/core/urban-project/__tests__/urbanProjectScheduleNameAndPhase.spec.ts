import { stepRevertAttempted } from "../../actions/actionsUtils";
import {
  namingCompleted,
  projectPhaseCompleted,
  scheduleCompleted,
  scheduleIntroductionCompleted,
} from "../actions/urbanProject.actions";
import {
  expectCurrentStep,
  expectUpdatedState,
  expectRevertedState,
  StoreBuilder,
} from "./testUtils";

describe("Urban project creation : schedule, name and phase steps", () => {
  describe("Custom creation mode", () => {
    describe("URBAN_PROJECT_SCHEDULE_INTRODUCTION step", () => {
      it("goes to URBAN_PROJECT_SCHEDULE_PROJECTION step when step is completed", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["URBAN_PROJECT_SCHEDULE_INTRODUCTION"])
          .build();
        const initialRootState = store.getState();

        store.dispatch(scheduleIntroductionCompleted());

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "URBAN_PROJECT_SCHEDULE_PROJECTION",
        });
      });

      it("goes to previous step when step is reverted", () => {
        const store = new StoreBuilder()
          .withStepsHistory([
            "URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE",
            "URBAN_PROJECT_SCHEDULE_INTRODUCTION",
          ])
          .build();

        store.dispatch(stepRevertAttempted());

        const newState = store.getState();
        expectCurrentStep(newState, "URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE");
      });
    });
    describe("URBAN_PROJECT_SCHEDULE_PROJECTION step", () => {
      it("goes to URBAN_PROJECT_PROJECT_PHASE step and sets installationSchedule, reinstatementSchedule, firstYearOfOperation when step is completed", () => {
        const store = new StoreBuilder()
          .withStepsHistory([
            "URBAN_PROJECT_SCHEDULE_INTRODUCTION",
            "URBAN_PROJECT_SCHEDULE_PROJECTION",
          ])
          .build();
        const initialRootState = store.getState();

        store.dispatch(
          scheduleCompleted({
            installationSchedule: { startDate: "2023-11-22", endDate: "2025-11-22" },
            reinstatementSchedule: { startDate: "2022-11-22", endDate: "2024-11-22" },
            firstYearOfOperation: 2025,
          }),
        );
        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "URBAN_PROJECT_PROJECT_PHASE",
          creationDataDiff: {
            installationSchedule: { startDate: "2023-11-22", endDate: "2025-11-22" },
            reinstatementSchedule: { startDate: "2022-11-22", endDate: "2024-11-22" },
            firstYearOfOperation: 2025,
          },
        });
      });
      it("goes to previous step and unset installationSchedule, reinstatementSchedule, firstYearOfOperation when step is reverted", () => {
        const store = new StoreBuilder()
          .withStepsHistory([
            "URBAN_PROJECT_SCHEDULE_INTRODUCTION",
            "URBAN_PROJECT_SCHEDULE_PROJECTION",
          ])
          .withCreationData({
            installationSchedule: { startDate: "2023-11-22", endDate: "2025-11-22" },
            reinstatementSchedule: { startDate: "2022-11-22", endDate: "2024-11-22" },
            firstYearOfOperation: 2025,
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(stepRevertAttempted());

        const newState = store.getState();
        expectRevertedState(initialRootState, newState, {
          creationDataDiff: {
            installationSchedule: undefined,
            reinstatementSchedule: undefined,
            firstYearOfOperation: undefined,
          },
        });
      });
    });
    describe("URBAN_PROJECT_PROJECT_PHASE step", () => {
      it("goes to URBAN_PROJECT_NAMING step and sets projectPhase when step is completed", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["URBAN_PROJECT_SCHEDULE_PROJECTION", "URBAN_PROJECT_PROJECT_PHASE"])
          .build();
        const initialRootState = store.getState();

        store.dispatch(projectPhaseCompleted("construction"));

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "URBAN_PROJECT_NAMING",
          creationDataDiff: {
            projectPhase: "construction",
          },
        });
      });
      it("goes to previous step and unset projectPhase when step is reverted", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["URBAN_PROJECT_SCHEDULE_PROJECTION", "URBAN_PROJECT_PROJECT_PHASE"])
          .withCreationData({
            projectPhase: "construction",
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(stepRevertAttempted());

        const newState = store.getState();
        expectRevertedState(initialRootState, newState, {
          creationDataDiff: {
            projectPhase: undefined,
          },
        });
      });
    });
    describe("URBAN_PROJECT_NAMING step", () => {
      it("goes to URBAN_PROJECT_FINAL_SUMMARY and sets name and description when step is completed", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["URBAN_PROJECT_PROJECT_PHASE", "URBAN_PROJECT_NAMING"])
          .build();
        const initialRootState = store.getState();

        store.dispatch(namingCompleted({ name: "Projet test", description: "Test" }));

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "URBAN_PROJECT_FINAL_SUMMARY",
          creationDataDiff: {
            name: "Projet test",
            description: "Test",
          },
        });
      });
      it("goes to previous step and unset name and description when step is reverted", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["URBAN_PROJECT_PROJECT_PHASE", "URBAN_PROJECT_NAMING"])
          .withCreationData({
            name: "Projet test",
            description: "Test",
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(stepRevertAttempted());

        const newState = store.getState();
        expectRevertedState(initialRootState, newState, {
          creationDataDiff: {
            name: undefined,
            description: undefined,
          },
        });
      });
    });
  });
});

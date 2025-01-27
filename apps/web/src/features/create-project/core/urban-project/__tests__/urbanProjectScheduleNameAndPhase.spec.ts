import {
  namingCompleted,
  namingReverted,
  projectPhaseCompleted,
  projectPhaseReverted,
  scheduleCompleted,
  scheduleIntroductionCompleted,
  scheduleIntroductionReverted,
  scheduleReverted,
} from "../actions/urbanProject.actions";
import {
  expectCurrentStep,
  expectUpdatedState,
  expectRevertedState,
  StoreBuilder,
} from "./testUtils";

describe("Urban project creation : schedule, name and phase steps", () => {
  describe("Custom creation mode", () => {
    describe("SCHEDULE_INTRODUCTION step", () => {
      it("goes to SCHEDULE_PROJECTION step when step is completed", () => {
        const store = new StoreBuilder().withStepsHistory(["SCHEDULE_INTRODUCTION"]).build();
        const initialRootState = store.getState();

        store.dispatch(scheduleIntroductionCompleted());

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "SCHEDULE_PROJECTION",
        });
      });

      it("goes to EXPENSES_PROJECTED_YEARLY_EXPENSES step when step is reverted", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["REVENUE_FINANCIAL_ASSISTANCE", "SCHEDULE_INTRODUCTION"])
          .build();

        store.dispatch(scheduleIntroductionReverted());

        const newState = store.getState();
        expectCurrentStep(newState, "REVENUE_FINANCIAL_ASSISTANCE");
      });
    });
    describe("SCHEDULE_PROJECTION step", () => {
      it("goes to PROJECT_PHASE step and sets installationSchedule, reinstatementSchedule, firstYearOfOperation when step is completed", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["SCHEDULE_INTRODUCTION", "SCHEDULE_PROJECTION"])
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
          currentStep: "PROJECT_PHASE",
          creationDataDiff: {
            installationSchedule: { startDate: "2023-11-22", endDate: "2025-11-22" },
            reinstatementSchedule: { startDate: "2022-11-22", endDate: "2024-11-22" },
            firstYearOfOperation: 2025,
          },
        });
      });
      it("goes to previous step and unset installationSchedule, reinstatementSchedule, firstYearOfOperation when step is reverted", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["SCHEDULE_INTRODUCTION", "SCHEDULE_PROJECTION"])
          .withCreationData({
            installationSchedule: { startDate: "2023-11-22", endDate: "2025-11-22" },
            reinstatementSchedule: { startDate: "2022-11-22", endDate: "2024-11-22" },
            firstYearOfOperation: 2025,
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(scheduleReverted());

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
    describe("PROJECT_PHASE step", () => {
      it("goes to NAMING step and sets projectPhase when step is completed", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["SCHEDULE_PROJECTION", "PROJECT_PHASE"])
          .build();
        const initialRootState = store.getState();

        store.dispatch(projectPhaseCompleted("construction"));

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "NAMING",
          creationDataDiff: {
            projectPhase: "construction",
          },
        });
      });
      it("goes to previous step and unset projectPhase when step is reverted", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["SCHEDULE_PROJECTION", "PROJECT_PHASE"])
          .withCreationData({
            projectPhase: "construction",
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(projectPhaseReverted());

        const newState = store.getState();
        expectRevertedState(initialRootState, newState, {
          creationDataDiff: {
            projectPhase: undefined,
          },
        });
      });
    });
    describe("NAMING step", () => {
      it("goes to FINAL_SUMMARY and sets name and description when step is completed", () => {
        const store = new StoreBuilder().withStepsHistory(["PROJECT_PHASE", "NAMING"]).build();
        const initialRootState = store.getState();

        store.dispatch(namingCompleted({ name: "Projet test", description: "Test" }));

        const newState = store.getState();
        expectUpdatedState(initialRootState, newState, {
          currentStep: "FINAL_SUMMARY",
          creationDataDiff: {
            name: "Projet test",
            description: "Test",
          },
        });
      });
      it("goes to previous step and unset name and description when step is reverted", () => {
        const store = new StoreBuilder()
          .withStepsHistory(["PROJECT_PHASE", "NAMING"])
          .withCreationData({
            name: "Projet test",
            description: "Test",
          })
          .build();
        const initialRootState = store.getState();

        store.dispatch(namingReverted());

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

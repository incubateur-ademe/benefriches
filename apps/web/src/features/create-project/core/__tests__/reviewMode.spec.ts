import { DEFAULT_APP_SETTINGS } from "@/features/app-settings/core/appSettings";
import { createStore, RootState } from "@/shared/core/store-config/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { stepRevertAttempted } from "../actions/actionsUtils";
import { getInitialState, ProjectCreationStep } from "../createProject.reducer";
import { reviewModeInitiated } from "../reviewMode.reducer";
import { expensesIntroductionCompleted } from "../urban-project/actions/urbanProject.actions";

export const expectCurrentStep = (state: RootState, step: ProjectCreationStep) => {
  expect(state.projectCreation.stepsHistory.at(-1)).toEqual(step);
};

export class StoreBuilder {
  preloadedRootState: Pick<RootState, "projectCreation" | "appSettings"> = {
    projectCreation: getInitialState(),
    appSettings: { ...DEFAULT_APP_SETTINGS, askForConfirmationOnStepRevert: false },
  };

  withStepsHistory(stepsHistory: ProjectCreationStep[]) {
    // we have to use destructuring here otherwise a TypeError will occur because the original state
    // is frozen by Redux-Toolkit automatically when passed to a reducer
    // see https://github.com/reduxjs/redux-toolkit/blob/7af5345eaeab83ca57b439aec41819420c503b34/packages/toolkit/src/createReducer.ts#L156
    this.preloadedRootState.projectCreation = {
      ...this.preloadedRootState.projectCreation,
      stepsHistory,
    };
    return this;
  }

  withReviewMode() {
    this.preloadedRootState.projectCreation = {
      ...this.preloadedRootState.projectCreation,
      isReviewing: true,
    };
    return this;
  }

  build() {
    return createStore(getTestAppDependencies(), this.preloadedRootState);
  }
}

describe("Project creation review mode", () => {
  describe("expenses and revenues review", () => {
    it("should allow review of urban project expenses and revenues", () => {
      const store = new StoreBuilder()
        .withStepsHistory([
          "URBAN_PROJECT_SCHEDULE_INTRODUCTION",
          "URBAN_PROJECT_SCHEDULE_PROJECTION",
          "URBAN_PROJECT_NAMING",
          "URBAN_PROJECT_FINAL_SUMMARY",
        ])
        .build();

      store.dispatch(
        reviewModeInitiated({
          sectionToReview: "urbanProjectExpensesAndRevenues",
        }),
      );

      const newState = store.getState();
      expect(newState.projectCreation.isReviewing).toBe(true);
      expectCurrentStep(newState, "URBAN_PROJECT_EXPENSES_INTRODUCTION");
    });

    it("should disable review mode when user reverts steps to the review starting step", () => {
      const store = new StoreBuilder()
        .withStepsHistory([
          "URBAN_PROJECT_SCHEDULE_INTRODUCTION",
          "URBAN_PROJECT_SCHEDULE_PROJECTION",
          "URBAN_PROJECT_NAMING",
          "URBAN_PROJECT_FINAL_SUMMARY",
        ])
        .build();

      store.dispatch(
        reviewModeInitiated({
          sectionToReview: "urbanProjectExpensesAndRevenues",
        }),
      );

      store.dispatch(expensesIntroductionCompleted());
      const stateAfterCompletion = store.getState();
      expectCurrentStep(stateAfterCompletion, "URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS");

      store.dispatch(stepRevertAttempted());
      store.dispatch(stepRevertAttempted());

      const finalState = store.getState();
      expectCurrentStep(finalState, "URBAN_PROJECT_FINAL_SUMMARY");
      expect(finalState.projectCreation.isReviewing).toBe(false);
    });
  });
});

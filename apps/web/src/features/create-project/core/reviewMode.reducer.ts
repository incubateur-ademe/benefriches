import { createAction, createReducer, isAnyOf } from "@reduxjs/toolkit";

import { stepRevertConfirmed } from "./actions/actionsUtils";
import { ProjectCreationState, ProjectCreationStep } from "./createProject.reducer";
import { financialAssistanceRevenuesCompleted } from "./urban-project/actions/urbanProject.actions";

const reviewableSectionStepMapping = {
  urbanProjectExpensesAndRevenues: "URBAN_PROJECT_EXPENSES_INTRODUCTION",
} as const satisfies Record<string, ProjectCreationStep>;

export const reviewModeInitiated = createAction<{
  sectionToReview: keyof typeof reviewableSectionStepMapping;
}>("reviewModeInitiated");

export const projectCreationReviewModeReducer = createReducer(
  {} as ProjectCreationState,
  (builder) => {
    builder
      .addCase(reviewModeInitiated, (state, action) => {
        state.isReviewing = true;
        state.reviewModeStartIndex = state.stepsHistory.length - 1;
        state.stepsHistory.push(reviewableSectionStepMapping[action.payload.sectionToReview]);
      })
      .addCase(stepRevertConfirmed, (state) => {
        const currentStepIndex = state.stepsHistory.length - 1;
        if (state.isReviewing && currentStepIndex === state.reviewModeStartIndex) {
          state.isReviewing = false;
          state.reviewModeStartIndex = undefined;
        }
      })
      .addMatcher(isAnyOf(financialAssistanceRevenuesCompleted), (state) => {
        if (state.isReviewing) {
          const updatedHistory = state.stepsHistory.slice(
            0,
            (state.reviewModeStartIndex ?? -1) + 1,
          );
          state.isReviewing = false;
          state.stepsHistory = updatedHistory;
          state.reviewModeStartIndex = undefined;
        }
      });
  },
);

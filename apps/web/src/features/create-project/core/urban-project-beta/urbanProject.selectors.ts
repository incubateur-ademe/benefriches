import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "@/shared/core/store-config/store";

import { ReadStateHelper } from "./urbanProject.helpers";
import { isInformationalStep, AnswerStepId } from "./urbanProjectSteps";

export const selectStepState = (state: RootState) => state.projectCreation.urbanProjectBeta.steps;

export const selectProjectSoilDistribution = createSelector(selectStepState, (state) =>
  ReadStateHelper.getProjectSoilDistribution(state),
);

export const selectStepAnswers = <T extends AnswerStepId>(stepId: T) =>
  createSelector([selectStepState], (steps) => {
    if (isInformationalStep(stepId)) {
      return undefined;
    }
    return (
      ReadStateHelper.getStepAnswers(steps, stepId) ??
      ReadStateHelper.getDefaultAnswers(steps, stepId)
    );
  });

export const selectHasBuildings = createSelector([selectStepState], (steps) =>
  ReadStateHelper.hasBuildings(steps),
);

export const selectProjectData = createSelector([selectStepState], (steps) =>
  ReadStateHelper.getProjectData(steps),
);

export const selectProjectSpaces = createSelector([selectStepState], (steps) =>
  ReadStateHelper.getSpacesDistribution(steps),
);

export const selectFormAnswers = createSelector([selectStepState], (steps) =>
  ReadStateHelper.getAllFormAnswers(steps),
);

export const selectCurrentStep = createSelector(
  [(state: RootState) => state.projectCreation.urbanProjectBeta],
  (state) => state.currentStep,
);

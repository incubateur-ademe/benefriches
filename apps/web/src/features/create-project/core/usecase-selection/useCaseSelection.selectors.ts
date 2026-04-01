import { createSelector } from "@reduxjs/toolkit";
import { DevelopmentPlanCategory, typedObjectEntries } from "shared";

import { RootState } from "@/app/store/store";

import { UseCaseSelectionStep } from "./useCaseSelection.reducer";
import {
  USE_CASE_SELECTION_STEP_GROUP_IDS,
  USE_CASE_SELECTION_STEP_GROUP_LABELS,
  USE_CASE_SELECTION_STEP_TO_GROUP,
} from "./useCaseSelectionStepperConfig";

type UseCaseSelectionWizardViewData = {
  currentStep: UseCaseSelectionStep;
};
export const selectUseCaseSelectionWizardViewData = createSelector(
  (state: RootState) => state.projectCreation,
  (state): UseCaseSelectionWizardViewData => ({
    currentStep: state.useCaseSelection.currentStep,
  }),
);

export const selectUseCaseSelectionStepperViewData = createSelector(
  (state: RootState) => state.projectCreation,
  (state) => {
    const availableGroupIds = new Set(
      typedObjectEntries(USE_CASE_SELECTION_STEP_TO_GROUP)
        .filter(([stepId]) => state.useCaseSelection.stepsSequence.includes(stepId))
        .map(([, { groupId }]) => groupId),
    );

    return {
      currentStep: state.useCaseSelection.currentStep,
      stepCategories: USE_CASE_SELECTION_STEP_GROUP_IDS.filter((id) =>
        availableGroupIds.has(id),
      ).map((id) => USE_CASE_SELECTION_STEP_GROUP_LABELS[id]),
    };
  },
);

export const selectUseCaseCreateModeViewData = createSelector(
  (state: RootState) => state.projectCreation,
  (state) => ({
    creationMode: state.useCaseSelection.creationMode,
  }),
);

export const selectRenewableEnergyTypeViewData = createSelector(
  (state: RootState) => state.projectCreation,
  (state) => ({
    projectType: state.useCaseSelection.projectDevelopmentPlan?.type,
  }),
);

export const selectProjectTypeViewData = createSelector(
  (state: RootState) => state.projectCreation,
  (state): DevelopmentPlanCategory | undefined =>
    state.useCaseSelection.projectDevelopmentPlan?.category,
);

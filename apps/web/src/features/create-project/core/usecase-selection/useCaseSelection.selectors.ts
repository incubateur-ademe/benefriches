import { createSelector } from "@reduxjs/toolkit";
import { DevelopmentPlanCategory } from "shared";

import { RootState } from "@/app/store/store";

import { ProjectCreationState } from "../createProject.reducer";
import { UseCaseSelectionStep } from "./useCaseSelection.reducer";
import {
  USE_CASE_SELECTION_STEP_GROUP_IDS,
  USE_CASE_SELECTION_STEP_GROUP_LABELS,
  USE_CASE_SELECTION_STEP_TO_GROUP,
  UseCaseSelectionStepGroupId,
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

type UseCaseSelectionStepperViewData = {
  currentStep: UseCaseSelectionStep;
  currentProjectFlow: ProjectCreationState["currentProjectFlow"];
  stepCategories: { title: string; targetStepId: UseCaseSelectionStep }[];
};

const getFirstStepOfGroup = (
  stepsSequence: UseCaseSelectionStep[],
  groupId: UseCaseSelectionStepGroupId,
): UseCaseSelectionStep | undefined =>
  stepsSequence.find((stepId) => USE_CASE_SELECTION_STEP_TO_GROUP[stepId].groupId === groupId);

const getAvailableGroupIds = (
  stepsSequence: UseCaseSelectionStep[],
): Set<UseCaseSelectionStepGroupId> =>
  new Set(stepsSequence.map((stepId) => USE_CASE_SELECTION_STEP_TO_GROUP[stepId].groupId));

export const selectUseCaseSelectionStepperViewData = createSelector(
  (state: RootState) => state.projectCreation,
  (state): UseCaseSelectionStepperViewData => {
    const { stepsSequence, currentStep } = state.useCaseSelection;

    const availableGroupIds = getAvailableGroupIds(stepsSequence);

    const stepCategories = USE_CASE_SELECTION_STEP_GROUP_IDS.filter((groupId) =>
      availableGroupIds.has(groupId),
    ).map((groupId) => {
      const targetStepId = getFirstStepOfGroup(stepsSequence, groupId);
      if (!targetStepId) throw new Error(`No step found for group "${groupId}"`);
      return {
        title: USE_CASE_SELECTION_STEP_GROUP_LABELS[groupId],
        targetStepId,
      };
    });

    return {
      currentProjectFlow: state.currentProjectFlow,
      currentStep,
      stepCategories,
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

import { createSelector } from "@reduxjs/toolkit";
import { DevelopmentPlanCategory, ProjectPhase } from "shared";

import { RootState } from "@/app/store/store";
import { StepVariant } from "@/shared/views/layout/WizardFormLayout/FormBaseStepperStep";

import { ProjectSuggestion } from "../project.types";
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
  stepCategories: { title: string; targetStepId: UseCaseSelectionStep; variant: StepVariant }[];
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

    const stepCategoriesIds = USE_CASE_SELECTION_STEP_GROUP_IDS.filter((groupId) =>
      availableGroupIds.has(groupId),
    );

    const { groupId: currentGroupId } = USE_CASE_SELECTION_STEP_TO_GROUP[currentStep];
    const currentStepIndex = stepCategoriesIds.indexOf(currentGroupId);

    const stepCategories: UseCaseSelectionStepperViewData["stepCategories"] = stepCategoriesIds.map(
      (groupId, index) => {
        const targetStepId = getFirstStepOfGroup(stepsSequence, groupId);
        if (!targetStepId) throw new Error(`No step found for group "${groupId}"`);
        return {
          title: USE_CASE_SELECTION_STEP_GROUP_LABELS[groupId],
          targetStepId,
          variant: {
            activity:
              state.currentProjectFlow === "USE_CASE_SELECTION" && index === currentStepIndex
                ? "current"
                : "inactive",
            validation:
              state.currentProjectFlow !== "USE_CASE_SELECTION" || currentStepIndex > index
                ? "completed"
                : "empty",
          },
        };
      },
    );

    return {
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

type ProjectTypeViewData = {
  developmentPlanCategory?: DevelopmentPlanCategory;
  projectSuggestions?: ProjectSuggestion[];
};
export const selectProjectTypeViewData = createSelector(
  (state: RootState) => state.projectCreation,
  (state): ProjectTypeViewData => ({
    developmentPlanCategory: state.useCaseSelection.projectDevelopmentPlan?.category,
    projectSuggestions: state.useCaseSelection.projectSuggestions,
  }),
);

type ProjectPhaseViewData = {
  projectPhase?: ProjectPhase;
};
export const selectProjectPhaseViewData = createSelector(
  (state: RootState) => state.projectCreation,
  (state): ProjectPhaseViewData => ({
    projectPhase: state.useCaseSelection.projectPhase,
  }),
);

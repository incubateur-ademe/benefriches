import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "@/shared/core/store-config/store";
import { buildStepGroupsFromSequence } from "@/shared/views/project-form/stepper/stepperConfig";

import { ProjectFormSelectors } from "../projectForm.selectors";
import { ReadStateHelper } from "./helpers/readState";
import {
  getUrbanProjectAvailableLocalAuthoritiesStakeholders,
  getUrbanProjectAvailableStakeholders,
} from "./helpers/stakeholders";
import {
  answersByStepSchemas,
  AnswerStepId,
  isAnswersStep,
  isSummaryStep,
  UrbanProjectCreationStep,
} from "./urbanProjectSteps";

export const createUrbanProjectFormSelectors = (
  entityName: "projectCreation" | "projectUpdate",
  selectors: ProjectFormSelectors,
) => {
  const selectSelf = (state: RootState) => state[entityName];

  const selectStepState = createSelector(selectSelf, (state) => state.urbanProject.steps);

  const selectProjectSoilsDistributionByType = createSelector(selectStepState, (state) =>
    ReadStateHelper.getProjectSoilDistributionBySoilType(state),
  );

  const selectProjectSoilsDistribution = createSelector(selectStepState, (state) =>
    ReadStateHelper.getProjectSoilDistribution(state),
  );

  const selectStepAnswers = <T extends AnswerStepId>(stepId: T) =>
    createSelector([selectStepState], (steps) => {
      if (!isAnswersStep(stepId)) {
        return undefined;
      }
      return (
        ReadStateHelper.getStepAnswers(steps, stepId) ??
        ReadStateHelper.getDefaultAnswers(steps, stepId)
      );
    });

  const selectProjectData = createSelector([selectStepState], (steps) =>
    ReadStateHelper.getProjectData(steps),
  );

  const selectSoilsCarbonStorageDifference = createSelector([selectStepState], (steps) => ({
    loadingState: steps.URBAN_PROJECT_SOILS_CARBON_SUMMARY?.loadingState ?? "idle",
    current: steps.URBAN_PROJECT_SOILS_CARBON_SUMMARY?.data?.current,
    projected: steps.URBAN_PROJECT_SOILS_CARBON_SUMMARY?.data?.projected,
  }));

  const selectProjectSummary = createSelector(
    [selectProjectData, selectProjectSoilsDistribution],
    (projectData, projectSoilsDistribution) => ({
      projectData,
      projectSoilsDistribution,
    }),
  );

  const selectProjectStepsSequence = createSelector(
    selectSelf,
    (state) => state.urbanProject.stepsSequence,
  );

  const selectProjectStepsSequenceWithStatus = createSelector(
    [selectProjectStepsSequence, selectStepState],
    (stepsSequence, stepsState): { isCompleted: boolean; stepId: UrbanProjectCreationStep }[] =>
      stepsSequence.map((stepId) => {
        if (isAnswersStep(stepId)) {
          const isCompleted = stepsState[stepId]?.completed ?? false;
          const isAnswerValid = answersByStepSchemas[stepId].safeParse(
            stepsState[stepId]?.payload,
          ).success;
          return {
            stepId,
            isCompleted: isCompleted && isAnswerValid,
          };
        }
        return {
          stepId,
          isCompleted: stepsState[stepId]?.completed ?? false,
        };
      }),
  );

  const selectStepsGroupedBySections = createSelector(
    [selectProjectStepsSequenceWithStatus],
    (selectProjectStepsSequenceWithStatus) =>
      buildStepGroupsFromSequence(selectProjectStepsSequenceWithStatus),
  );

  const selectIsFormStatusValid = createSelector(
    [selectProjectStepsSequenceWithStatus],
    (stepsSequenceWithStatus) => {
      return stepsSequenceWithStatus.every(({ stepId, isCompleted }) =>
        isAnswersStep(stepId) ? isCompleted : true,
      );
    },
  );

  const selectNextEmptyStep = createSelector(
    [selectProjectStepsSequenceWithStatus],
    (stepsSequenceWithStatus) =>
      stepsSequenceWithStatus.find(
        ({ isCompleted, stepId }) =>
          (isAnswersStep(stepId) || isSummaryStep(stepId)) && !isCompleted,
      )?.stepId,
  );

  const selectProjectDeveloper = createSelector(
    [selectStepState],
    (steps) =>
      ReadStateHelper.getStepAnswers(steps, "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER")
        ?.projectDeveloper,
  );

  const selectReinstatementContractOwner = createSelector(
    [selectStepState],
    (steps) =>
      ReadStateHelper.getStepAnswers(
        steps,
        "URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER",
      )?.reinstatementContractOwner,
  );

  const selectUrbanProjectAvailableStakeholders = createSelector(
    [
      selectors.selectProjectAvailableStakeholders,
      selectProjectDeveloper,
      selectReinstatementContractOwner,
    ],
    (projectAvailableStakeholders, projectDeveloper, reinstatementContractOwner) =>
      getUrbanProjectAvailableStakeholders({
        projectAvailableStakeholders,
        projectDeveloper,
        reinstatementContractOwner,
      }),
  );

  const selectUrbanProjectAvailableLocalAuthoritiesStakeholders = createSelector(
    [
      selectors.selectAvailableLocalAuthoritiesStakeholders,
      selectProjectDeveloper,
      selectReinstatementContractOwner,
    ],
    (availableLocalAuthoritiesStakeholders, projectDeveloper, reinstatementContractOwner) => {
      return getUrbanProjectAvailableLocalAuthoritiesStakeholders({
        availableLocalAuthoritiesStakeholders,
        projectDeveloper,
        reinstatementContractOwner,
      });
    },
  );

  const selectPendingStepCompletion = createSelector(
    [selectSelf],
    (state) => state.urbanProject.pendingStepCompletion,
  );

  const selectSaveState = createSelector([selectSelf], (state) => state.urbanProject.saveState);

  return {
    selectStepState,
    selectProjectSoilsDistributionByType,
    selectProjectSoilsDistribution,
    selectStepAnswers,
    selectSoilsCarbonStorageDifference,
    selectIsFormStatusValid,
    selectProjectSummary,
    selectStepsGroupedBySections,
    selectNextEmptyStep,
    selectUrbanProjectAvailableStakeholders,
    selectUrbanProjectAvailableLocalAuthoritiesStakeholders,
    selectPendingStepCompletion,
    selectSaveState,
    ...selectors,
  };
};

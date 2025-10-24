import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "@/shared/core/store-config/store";

import { ProjectFormSelectors } from "../projectForm.selectors";
import { ReadStateHelper } from "./helpers/readState";
import {
  getUrbanProjectAvailableLocalAuthoritiesStakeholders,
  getUrbanProjectAvailableStakeholders,
} from "./helpers/stakeholders";
import { getStepperList } from "./helpers/stepperList";
import { AnswerStepId, isAnswersStep, isInformationalStep } from "./urbanProjectSteps";

export const createUrbanProjectFormSelectors = (
  entityName: "projectCreation" | "projectUpdate",
  selectors: ProjectFormSelectors,
) => {
  const INITIAL_STEP =
    entityName === "projectCreation"
      ? "URBAN_PROJECT_CREATE_MODE_SELECTION"
      : "URBAN_PROJECT_SPACES_CATEGORIES_INTRODUCTION";

  const selectSelf = (state: RootState) => state[entityName];

  const selectStepState = createSelector(selectSelf, (state) => state.urbanProject.steps);

  const selectProjectSoilsDistribution = createSelector(selectStepState, (state) =>
    ReadStateHelper.getProjectSoilDistributionBySoilType(state),
  );

  const selectStepAnswers = <T extends AnswerStepId>(stepId: T) =>
    createSelector([selectStepState], (steps) => {
      if (isInformationalStep(stepId)) {
        return undefined;
      }
      return (
        ReadStateHelper.getStepAnswers(steps, stepId) ??
        ReadStateHelper.getDefaultAnswers(steps, stepId)
      );
    });

  const selectProjectSpaces = createSelector([selectStepState], (steps) =>
    ReadStateHelper.getSpacesDistribution(steps),
  );

  const selectFormAnswers = createSelector([selectStepState], (steps) =>
    ReadStateHelper.getAllFormAnswers(steps),
  );

  const selectSoilsCarbonStorageDifference = createSelector([selectStepState], (steps) => ({
    loadingState: steps.URBAN_PROJECT_SOILS_CARBON_SUMMARY?.loadingState ?? "idle",
    current: steps.URBAN_PROJECT_SOILS_CARBON_SUMMARY?.data?.current,
    projected: steps.URBAN_PROJECT_SOILS_CARBON_SUMMARY?.data?.projected,
  }));

  const selectProjectSummary = createSelector(
    [selectFormAnswers, selectProjectSpaces, selectProjectSoilsDistribution],
    (projectData, projectSpaces, projectSoilsDistribution) => ({
      projectData,
      projectSpaces,
      projectSoilsDistribution,
    }),
  );

  const selectAvailableStepsStateList = createSelector(
    [(state: RootState) => state[entityName].siteData, selectStepState],
    (siteData, stepsState) => getStepperList({ siteData, stepsState }, INITIAL_STEP),
  );

  const selectAvailableStepsState = createSelector(
    [selectAvailableStepsStateList],
    (availableStepsStateList) =>
      Object.fromEntries(
        availableStepsStateList.map(({ order, status, stepId }) => [stepId, { order, status }]),
      ),
  );

  const selectIsFormStatusValid = createSelector(
    [selectAvailableStepsStateList],
    (availableStepsState) => {
      return availableStepsState.every(({ stepId, status }) =>
        isAnswersStep(stepId) ? status === "completed" : true,
      );
    },
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

  return {
    selectStepState,
    selectProjectSoilsDistribution,
    selectStepAnswers,
    selectSoilsCarbonStorageDifference,
    selectIsFormStatusValid,
    selectProjectSummary,
    selectAvailableStepsState,
    selectUrbanProjectAvailableStakeholders,
    selectUrbanProjectAvailableLocalAuthoritiesStakeholders,
    selectPendingStepCompletion,
    ...selectors,
  };
};

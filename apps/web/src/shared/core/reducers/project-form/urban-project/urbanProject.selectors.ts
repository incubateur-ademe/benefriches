import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "@/app/store/store";
import { buildStepGroupsFromSequence } from "@/shared/views/project-form/stepper/stepperConfig";

import { createProjectFormSelectors } from "../projectForm.selectors";
import { getProjectSummary } from "./helpers/projectSummary";
import { ReadStateHelper } from "./helpers/readState";
import {
  getProjectSoilDistribution,
  getProjectSoilDistributionBySoilType,
} from "./helpers/readers/soilsReaders";
import { createSelectUsesFloorSurfaceAreaViewData } from "./step-handlers/buildings/buildings-uses-floor-surface-area/buildingsUsesFloorSurfaceArea.selector";
import { createSelectReinstatementExpensesViewData } from "./step-handlers/expenses/expenses-reinstatement/expensesReinstatement.selector";
import { createSelectSiteResaleRevenueViewData } from "./step-handlers/revenues/revenue-expected-site-resale/revenueExpectedSiteResale.selector";
import { createSelectScheduleProjectionViewData } from "./step-handlers/schedule/schedule-projection/scheduleProjection.selector";
import { createSelectSoilsCarbonStorageDifference } from "./step-handlers/soils/soils-carbon-summary/soilsCarbonSummary.selector";
import { createSelectSoilsDecontaminationSurfaceAreaViewData } from "./step-handlers/soils/soils-decontamination-surface-area/soilsDecontaminationSurfaceArea.selector";
import { createSelectSoilsSummaryViewData } from "./step-handlers/soils/soils-summary/soilsSummary.selector";
import { createSelectPublicGreenSpacesIntroductionViewData } from "./step-handlers/spaces/public-green-spaces-introduction/publicGreenSpacesIntroduction.selector";
import { createSelectPublicGreenSpacesSoilsDistributionViewData } from "./step-handlers/spaces/public-green-spaces-soils-distribution/publicGreenSpacesSoilsDistribution.selector";
import { createSelectSpacesSelectionViewData } from "./step-handlers/spaces/spaces-selection/spacesSelection.selector";
import { createSelectSpacesSurfaceAreaViewData } from "./step-handlers/spaces/spaces-surface-area/spacesSurfaceArea.selector";
import { createSelectProjectDeveloperViewData } from "./step-handlers/stakeholders/stakeholders-project-developer/stakeholdersProjectDeveloper.selector";
import { createSelectReinstatementContractOwnerViewData } from "./step-handlers/stakeholders/stakeholders-reinstatement-contract-owner/stakeholdersReinstatementContractOwner.selector";
import {
  createSelectUrbanProjectAvailableLocalAuthoritiesStakeholders,
  createSelectUrbanProjectAvailableStakeholders,
} from "./step-handlers/stakeholders/stakeholders.selector";
import { createSelectUrbanProjectSummaryViewData } from "./step-handlers/summary/final-summary/finalSummary.selector";
import { createSelectPublicGreenSpacesSurfaceAreaViewData } from "./step-handlers/uses/public-green-spaces-surface-area/publicGreenSpacesSurfaceArea.selector";
import {
  answersByStepSchemas,
  AnswerStepId,
  isAnswersStep,
  isSummaryStep,
  UrbanProjectCreationStep,
} from "./urbanProjectSteps";

export const createUrbanProjectFormSelectors = (
  entityName: "projectCreation" | "projectUpdate",
) => {
  const selectors = createProjectFormSelectors(entityName);
  const selectSelf = (state: RootState) => state[entityName];

  const selectStepState = createSelector(selectSelf, (state) => state.urbanProject.steps);

  const selectProjectSoilsDistributionByType = createSelector(selectStepState, (state) =>
    getProjectSoilDistributionBySoilType(state),
  );

  const selectProjectSoilsDistribution = createSelector(selectStepState, (state) =>
    getProjectSoilDistribution(state),
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

  const selectSoilsCarbonStorageDifference =
    createSelectSoilsCarbonStorageDifference(selectStepState);

  const selectProjectStepsSequence = createSelector(
    selectSelf,
    (state) => state.urbanProject.stepsSequence,
  );

  const selectProjectSummary = createSelector(
    [selectStepState, selectProjectStepsSequence, selectProjectSoilsDistribution],
    (steps, stepsSequence) => getProjectSummary(steps, stepsSequence),
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

  const selectUrbanProjectAvailableStakeholders = createSelectUrbanProjectAvailableStakeholders(
    selectStepState,
    selectors.selectProjectAvailableStakeholders,
  );

  const selectUrbanProjectAvailableLocalAuthoritiesStakeholders =
    createSelectUrbanProjectAvailableLocalAuthoritiesStakeholders(
      selectStepState,
      selectors.selectAvailableLocalAuthoritiesStakeholders,
    );

  const selectPendingStepCompletion = createSelector(
    [selectSelf],
    (state) => state.urbanProject.pendingStepCompletion,
  );

  const selectSaveState = createSelector([selectSelf], (state) => state.urbanProject.saveState);

  const selectSiteResaleEstimationLoadingState = createSelector(
    [selectSelf],
    (state) => state.urbanProject.siteResaleEstimationLoadingState,
  );

  const selectSiteResaleRevenueViewData = createSelectSiteResaleRevenueViewData(
    selectStepState,
    selectSiteResaleEstimationLoadingState,
  );

  const selectPublicGreenSpacesSurfaceAreaViewData =
    createSelectPublicGreenSpacesSurfaceAreaViewData(
      selectStepState,
      selectors.selectSiteSurfaceArea,
    );

  const selectUsesFloorSurfaceAreaViewData =
    createSelectUsesFloorSurfaceAreaViewData(selectStepState);

  const selectSpacesSelectionViewData = createSelectSpacesSelectionViewData(
    selectStepState,
    selectors.selectSiteSoilsDistribution,
  );

  const selectSpacesSurfaceAreaViewData = createSelectSpacesSurfaceAreaViewData(
    selectStepState,
    selectors.selectSiteSurfaceArea,
    selectors.selectSiteSoilsDistribution,
  );

  const selectPublicGreenSpacesSoilsDistributionViewData =
    createSelectPublicGreenSpacesSoilsDistributionViewData(
      selectStepState,
      selectors.selectSiteSoilsDistribution,
    );

  const selectPublicGreenSpacesIntroductionViewData =
    createSelectPublicGreenSpacesIntroductionViewData(selectors.selectSiteSoilsDistribution);

  const selectProjectDeveloperViewData = createSelectProjectDeveloperViewData(
    selectStepState,
    selectUrbanProjectAvailableStakeholders,
    selectUrbanProjectAvailableLocalAuthoritiesStakeholders,
  );

  const selectSoilsSummaryViewData = createSelectSoilsSummaryViewData(
    selectors.selectSiteSoilsDistribution,
    selectProjectSoilsDistributionByType,
  );

  const selectReinstatementContractOwnerViewData = createSelectReinstatementContractOwnerViewData(
    selectStepState,
    selectUrbanProjectAvailableStakeholders,
    selectUrbanProjectAvailableLocalAuthoritiesStakeholders,
  );

  const selectReinstatementExpensesViewData = createSelectReinstatementExpensesViewData(
    selectStepState,
    selectors.selectSiteSoilsDistribution,
  );

  const selectUrbanProjectSummaryViewData = createSelectUrbanProjectSummaryViewData(
    selectIsFormStatusValid,
    selectProjectSummary,
    selectProjectSoilsDistribution,
    selectSaveState,
    selectStepsGroupedBySections,
  );

  const selectScheduleProjectionViewData = createSelectScheduleProjectionViewData(
    selectStepState,
    selectors.selectIsSiteFriche,
  );

  const selectSoilsDecontaminationSurfaceAreaViewData =
    createSelectSoilsDecontaminationSurfaceAreaViewData(
      selectStepState,
      selectors.selectSiteContaminatedSurfaceArea,
    );

  const selectNavigationBlockerDialogViewData = createSelector(
    selectSaveState,
    selectIsFormStatusValid,
    (saveState, isFormValid) => ({ saveState, isFormValid }),
  );

  const selectUrbanProjectCreationStepperViewData = createSelector(
    selectStepsGroupedBySections,
    selectNextEmptyStep,
    selectSaveState,
    (stepsGroupedBySections, nextEmptyStep, saveState) => ({
      stepsGroupedBySections,
      nextEmptyStep,
      saveState,
    }),
  );

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
    selectNavigationBlockerDialogViewData,
    selectUrbanProjectCreationStepperViewData,
    selectSiteResaleRevenueViewData,
    selectPublicGreenSpacesSurfaceAreaViewData,
    selectUsesFloorSurfaceAreaViewData,
    selectSpacesSelectionViewData,
    selectSpacesSurfaceAreaViewData,
    selectPublicGreenSpacesSoilsDistributionViewData,
    selectPublicGreenSpacesIntroductionViewData,
    selectProjectDeveloperViewData,
    selectSoilsSummaryViewData,
    selectReinstatementContractOwnerViewData,
    selectReinstatementExpensesViewData,
    selectUrbanProjectSummaryViewData,
    selectScheduleProjectionViewData,
    selectSoilsDecontaminationSurfaceAreaViewData,
    ...selectors,
  };
};

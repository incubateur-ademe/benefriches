import { createSelector } from "@reduxjs/toolkit";

import {
  AnswerStepHandler,
  InfoStepHandler,
} from "@/features/create-project/core/urban-project/step-handlers/stepHandler.type";
import { stepHandlerRegistry } from "@/features/create-project/core/urban-project/step-handlers/stepHandlerRegistry";
import { RootState } from "@/shared/core/store-config/store";

import { ProjectFormSelectors } from "../projectForm.selectors";
import { ReadStateHelper } from "./helpers/readState";
import {
  getUrbanProjectAvailableLocalAuthoritiesStakeholders,
  getUrbanProjectAvailableStakeholders,
} from "./helpers/stakeholders";
import {
  ANSWER_STEPS,
  AnswerStepId,
  INFORMATIONAL_STEPS,
  isAnswersStep,
  isInformationalStep,
  UrbanProjectCreationStep,
} from "./urbanProjectSteps";

export const createUrbanProjectFormSelectors = (
  entityName: "projectCreation" | "projectUpdate",
  selectors: ProjectFormSelectors,
) => {
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

  const selectAvailableStepsStateEntries = createSelector(
    [(state: RootState) => state[entityName].siteData, selectStepState],
    (siteData, stepsState) => {
      const creationMode = stepsState.URBAN_PROJECT_CREATE_MODE_SELECTION;

      let currentStep: UrbanProjectCreationStep | undefined = "URBAN_PROJECT_CREATE_MODE_SELECTION";
      let iterationCount = 0;

      const steps: [UrbanProjectCreationStep, { order: number; status: "empty" | "completed" }][] =
        [
          [
            currentStep,
            {
              order: iterationCount,
              status: creationMode?.completed ? "completed" : "empty",
            },
          ],
        ];

      if (!creationMode?.payload) {
        return steps;
      }

      const handler = stepHandlerRegistry[currentStep];
      currentStep = handler.getNextStepId(
        {
          siteData,
          stepsState,
        },
        creationMode.payload,
      );
      iterationCount++;

      const isLastStep =
        currentStep === "URBAN_PROJECT_CREATION_RESULT" ||
        currentStep === "URBAN_PROJECT_EXPRESS_CREATION_RESULT";

      while (!isLastStep && iterationCount < ANSWER_STEPS.length + INFORMATIONAL_STEPS.length) {
        steps.push([
          currentStep,
          {
            order: iterationCount,
            status: stepsState[currentStep]?.completed ? "completed" : "empty",
          },
        ]);

        const handler = stepHandlerRegistry[currentStep] as
          | InfoStepHandler
          | AnswerStepHandler<AnswerStepId>
          | undefined;

        if (!handler?.getNextStepId) {
          break;
        }

        try {
          currentStep = handler.getNextStepId({
            siteData,
            stepsState,
          });
          iterationCount++;
        } catch (error) {
          console.error(
            `Erreur lors de l'obtention de l'étape suivante pour ${currentStep}:`,
            error,
          );
          break;
        }
      }

      return steps;
    },
  );

  const selectAvailableStepsState = createSelector(
    [selectAvailableStepsStateEntries],
    (availableStepsStateEntries) => Object.fromEntries(availableStepsStateEntries),
  );

  const selectIsFormStatusValid = createSelector(
    [selectAvailableStepsStateEntries],
    (availableStepsState) => {
      return availableStepsState.every(([stepId, { status }]) =>
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

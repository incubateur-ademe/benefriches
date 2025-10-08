import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "@/shared/core/store-config/store";

import { ReadStateHelper } from "./helpers/readState";
import { AnswerStepHandler, InfoStepHandler } from "./step-handlers/stepHandler.type";
import { stepHandlerRegistry } from "./step-handlers/stepHandlerRegistry";
import {
  isInformationalStep,
  AnswerStepId,
  ANSWER_STEPS,
  INFORMATIONAL_STEPS,
  isAnswersStep,
  UrbanProjectCreationStep,
} from "./urbanProjectSteps";

export const selectStepState = (state: RootState) => state.projectCreation.urbanProject.steps;

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
  [(state: RootState) => state.projectCreation.urbanProject],
  (state) => state.currentStep,
);

const selectAvailableStepsStateEntries = createSelector(
  [(state: RootState) => state.projectCreation.siteData, selectStepState],
  (siteData, stepsState) => {
    const creationMode = stepsState.URBAN_PROJECT_CREATE_MODE_SELECTION;

    let currentStep: UrbanProjectCreationStep | undefined = "URBAN_PROJECT_CREATE_MODE_SELECTION";
    let iterationCount = 0;

    const steps: [UrbanProjectCreationStep, { order: number; status: "empty" | "completed" }][] = [
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
        console.error(`Erreur lors de l'obtention de l'étape suivante pour ${currentStep}:`, error);
        break;
      }
    }

    return steps;
  },
);

export const selectAvailableStepsState = createSelector(
  [selectAvailableStepsStateEntries],
  (availableStepsStateEntries) => Object.fromEntries(availableStepsStateEntries),
);

export const selectIsFormStatusValid = createSelector(
  [selectAvailableStepsStateEntries],
  (availableStepsState) => {
    return availableStepsState.every(([stepId, { status }]) =>
      isAnswersStep(stepId) ? status === "completed" : true,
    );
  },
);

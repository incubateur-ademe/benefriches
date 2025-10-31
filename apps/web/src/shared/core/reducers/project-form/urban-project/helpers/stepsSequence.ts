import { StepContext } from "../step-handlers/stepHandler.type";
import { stepHandlerRegistry } from "../step-handlers/stepHandlerRegistry";
import {
  ANSWER_STEPS,
  INTRODUCTION_STEPS,
  SUMMARY_STEPS,
  UrbanProjectCreationStep,
} from "../urbanProjectSteps";

const MAX_STEPS_NUMBER = ANSWER_STEPS.length + INTRODUCTION_STEPS.length + SUMMARY_STEPS.length;
export const computeProjectStepsSequence = (
  { siteData, stepsState }: StepContext,
  initialStep: UrbanProjectCreationStep,
) => {
  const stepsSequence: UrbanProjectCreationStep[] = [];
  let currentStep: UrbanProjectCreationStep = initialStep;
  let iterationCount = 0;

  while (iterationCount < MAX_STEPS_NUMBER) {
    stepsSequence.push(currentStep);

    if (currentStep === "URBAN_PROJECT_CREATE_MODE_SELECTION") {
      if (!stepsState.URBAN_PROJECT_CREATE_MODE_SELECTION?.payload) {
        break;
      }
      currentStep = stepHandlerRegistry[currentStep].getNextStepId(
        { siteData, stepsState },
        stepsState.URBAN_PROJECT_CREATE_MODE_SELECTION?.payload,
      );
    } else {
      const getNextStepId = stepHandlerRegistry[currentStep].getNextStepId;
      if (!getNextStepId) {
        break;
      }
      currentStep = getNextStepId({ siteData, stepsState });
    }

    iterationCount++;
  }

  return stepsSequence;
};

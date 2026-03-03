import {
  ANSWER_STEPS,
  INTRODUCTION_STEPS,
  type RenewableEnergyCreationStep,
  SUMMARY_STEPS,
} from "../renewableEnergySteps";
import type { StepContext } from "../step-handlers/stepHandler.type";
import { stepHandlerRegistry } from "../step-handlers/stepHandlerRegistry";

const MAX_STEPS_NUMBER = ANSWER_STEPS.length + INTRODUCTION_STEPS.length + SUMMARY_STEPS.length;

export const computeStepsSequence = (
  { siteData, stepsState }: StepContext,
  initialStep: RenewableEnergyCreationStep,
): RenewableEnergyCreationStep[] => {
  const stepsSequence: RenewableEnergyCreationStep[] = [];
  let currentStep: RenewableEnergyCreationStep = initialStep;
  let iterationCount = 0;

  while (iterationCount < MAX_STEPS_NUMBER) {
    stepsSequence.push(currentStep);

    const getNextStepId = stepHandlerRegistry[currentStep].getNextStepId;
    if (!getNextStepId) {
      break;
    }
    currentStep = getNextStepId({ siteData, stepsState });

    iterationCount++;
  }

  return stepsSequence;
};

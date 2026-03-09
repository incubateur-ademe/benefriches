import type { UrbanZoneStepContext } from "../step-handlers/stepHandler.type";
import { urbanZoneStepHandlerRegistry } from "../step-handlers/stepHandlerRegistry";
import type { UrbanZoneSiteCreationStep } from "../urbanZoneSteps";

const MAX_STEPS_NUMBER = 30;

export const computeStepsSequence = (
  context: UrbanZoneStepContext,
  initialStep: UrbanZoneSiteCreationStep,
): UrbanZoneSiteCreationStep[] => {
  const stepsSequence: UrbanZoneSiteCreationStep[] = [];
  let currentStep: UrbanZoneSiteCreationStep = initialStep;
  let iterationCount = 0;

  while (iterationCount < MAX_STEPS_NUMBER) {
    stepsSequence.push(currentStep);

    const handler = urbanZoneStepHandlerRegistry[currentStep];
    if (!handler?.getNextStepId) {
      break;
    }
    currentStep = handler.getNextStepId(context);
    iterationCount++;
  }

  return stepsSequence;
};

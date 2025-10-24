import { AnswerStepHandler, InfoStepHandler, StepContext } from "../step-handlers/stepHandler.type";
import { stepHandlerRegistry } from "../step-handlers/stepHandlerRegistry";
import {
  ANSWER_STEPS,
  AnswerStepId,
  INFORMATIONAL_STEPS,
  UrbanProjectCreationStep,
} from "../urbanProjectSteps";

const MAX_STEPS_NUMBER = ANSWER_STEPS.length + INFORMATIONAL_STEPS.length;

export const getStepperList = (
  { siteData, stepsState }: StepContext,
  initialStep: UrbanProjectCreationStep,
) => {
  let currentStep: UrbanProjectCreationStep | undefined = initialStep;
  let iterationCount = 0;

  const steps: {
    stepId: UrbanProjectCreationStep;
    order: number;
    status: "empty" | "completed";
  }[] = [];

  let shouldStop = false;

  while (currentStep && iterationCount < MAX_STEPS_NUMBER && !shouldStop) {
    steps.push({
      stepId: currentStep,
      order: iterationCount,
      status: stepsState[currentStep]?.completed ? "completed" : "empty",
    });

    if (currentStep === "URBAN_PROJECT_CREATE_MODE_SELECTION") {
      const creationMode = stepsState.URBAN_PROJECT_CREATE_MODE_SELECTION;

      if (!creationMode?.payload) {
        shouldStop = true;
        break;
      }

      currentStep = stepHandlerRegistry[currentStep].getNextStepId(
        {
          siteData,
          stepsState,
        },
        creationMode.payload,
      );
      continue;
    }

    const handler = stepHandlerRegistry[currentStep] as
      | InfoStepHandler
      | AnswerStepHandler<AnswerStepId>
      | undefined;

    if (!handler?.getNextStepId) {
      shouldStop = true;
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
};

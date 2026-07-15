import { StepHandlerParams } from "../stepHandler.type";

export const computeStepsSequence = <StepId extends string, TContext, TAnswers>(
  { context, answers }: StepHandlerParams<TContext, TAnswers>,
  initialStep: StepId,
  registry: Record<
    StepId,
    { getNextStepId?: (params: StepHandlerParams<TContext, TAnswers>) => StepId }
  >,
): StepId[] => {
  const maxSteps = Object.keys(registry).length;
  const stepsSequence: StepId[] = [];
  let currentStep: StepId = initialStep;
  let iterationCount = 0;

  while (iterationCount < maxSteps) {
    stepsSequence.push(currentStep);

    const getNextStepId = registry[currentStep].getNextStepId;
    if (!getNextStepId) {
      break;
    }
    currentStep = getNextStepId({ context, answers });

    iterationCount++;
  }

  return stepsSequence;
};

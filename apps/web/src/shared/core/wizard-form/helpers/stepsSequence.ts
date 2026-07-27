import { StepHandlerParams } from "../stepHandler.type";

// `getNextStepId`'s second parameter is the answers of the step being left. On the completion
// path `computeStepChanges` passes the freshly submitted ones (the state isn't mutated yet);
// here the step is already committed, so we pass the ones stored for it. Handlers that branch
// on their own answer (site purchase, uses selection, buildings footprint to reuse) would
// otherwise be walked as if unanswered, and their branch would be missing from the sequence.
// Declared as a method (not a property holding an arrow type) so its parameters stay bivariant
// under `strictFunctionTypes`, exactly like `AnswerStepHandler.getNextStepId`: each handler
// narrows the second parameter to its own answers type, which a registry-wide union cannot
// express contravariantly.
type SequenceStepHandler<StepId, TContext, TAnswers> = {
  getNextStepId?(
    params: StepHandlerParams<TContext, TAnswers>,
    answers?: TAnswers[keyof TAnswers],
  ): StepId;
};

export const computeStepsSequence = <StepId extends string, TContext, TAnswers>(
  { context, answers }: StepHandlerParams<TContext, TAnswers>,
  initialStep: StepId,
  registry: Record<StepId, SequenceStepHandler<StepId, TContext, TAnswers>>,
): StepId[] => {
  const maxSteps = Object.keys(registry).length;
  const stepsSequence: StepId[] = [];
  let currentStep: StepId = initialStep;
  let iterationCount = 0;

  // StepId covers info steps too, which `answers` — keyed by the answer steps only — has no
  // entry for; the lookup simply yields undefined for those.
  const storedAnswers = answers as Record<
    string,
    { payload?: TAnswers[keyof TAnswers] } | undefined
  >;

  while (iterationCount < maxSteps) {
    stepsSequence.push(currentStep);

    const handler = registry[currentStep];
    if (!handler.getNextStepId) {
      break;
    }
    currentStep = handler.getNextStepId({ context, answers }, storedAnswers[currentStep]?.payload);

    iterationCount++;
  }

  return stepsSequence;
};

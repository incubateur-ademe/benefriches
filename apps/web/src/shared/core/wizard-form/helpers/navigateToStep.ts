import { AnswerStepHandler, InfoStepHandler } from "../stepHandler.type";
import { MutableWizardFormState, MutateStateHelper } from "./mutateState";

export const navigateToAndLoadStep = <StepId extends PropertyKey, TContext, TAnswers>(
  form: MutableWizardFormState<StepId, TAnswers>,
  context: TContext,
  stepId: StepId,
  registry: Record<
    StepId,
    | AnswerStepHandler<StepId, TContext, TAnswers, keyof TAnswers>
    | InfoStepHandler<StepId, StepId, TContext, TAnswers>
  >,
) => {
  const handler = registry[stepId];

  if ("getDefaultAnswers" in handler && handler.getDefaultAnswers) {
    if (!form.steps[handler.stepId]?.defaultValues) {
      const defaults = handler.getDefaultAnswers({ context, answers: form.steps });

      if (defaults) {
        MutateStateHelper.setDefaultValues(form, handler.stepId, defaults);
      }
    }
  }

  MutateStateHelper.navigateToStep(form, stepId);
};

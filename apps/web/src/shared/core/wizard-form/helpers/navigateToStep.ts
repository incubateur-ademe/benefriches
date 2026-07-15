import { AnswerStepHandler, InfoStepHandler } from "../stepHandler.type";
import { MutableWizardFormState, MutateStateHelper } from "./mutateState";

/**
 * Combined (answer + info) handler registry, keyed by every step id — the shape needed to
 * navigate/load any step regardless of its kind. Shared with `applyStepChanges`, which drives
 * this same navigation as part of completing a step.
 */
export type StepRegistry<StepId extends PropertyKey, TContext, TAnswers> = Record<
  StepId,
  | AnswerStepHandler<StepId, TContext, TAnswers, keyof TAnswers>
  | InfoStepHandler<StepId, StepId, TContext, TAnswers>
>;

export const navigateToAndLoadStep = <StepId extends PropertyKey, TContext, TAnswers>(
  form: MutableWizardFormState<StepId, TAnswers>,
  context: TContext,
  stepId: StepId,
  registry: StepRegistry<StepId, TContext, TAnswers>,
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

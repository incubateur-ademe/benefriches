import { WizardFormStepsState, WizardStepState } from "../stepHandler.type";

export const ReadStateHelper = {
  getStep<TAnswers, K extends keyof TAnswers>(
    steps: WizardFormStepsState<TAnswers>,
    stepId: K,
  ): WizardStepState<TAnswers[K]> | undefined {
    return steps[stepId];
  },

  getStepAnswers<TAnswers, K extends keyof TAnswers>(
    steps: WizardFormStepsState<TAnswers>,
    stepId: K,
  ): TAnswers[K] | undefined {
    return this.getStep<TAnswers, K>(steps, stepId)?.payload;
  },

  getDefaultAnswers<TAnswers, K extends keyof TAnswers>(
    steps: WizardFormStepsState<TAnswers>,
    stepId: K,
  ): TAnswers[K] | undefined {
    return this.getStep<TAnswers, K>(steps, stepId)?.defaultValues;
  },
} as const;

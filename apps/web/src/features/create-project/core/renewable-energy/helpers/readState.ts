import type { AnswersByStep, AnswerStepId } from "../renewableEnergySteps";
import type { RenewableEnergyStepsState } from "../step-handlers/stepHandler.type";

export const ReadStateHelper = {
  getStep<K extends AnswerStepId = AnswerStepId>(steps: RenewableEnergyStepsState, stepId: K) {
    return steps[stepId] as
      | {
          completed: boolean;
          payload?: AnswersByStep[K];
          defaultValues?: AnswersByStep[K];
        }
      | undefined;
  },

  getStepAnswers<K extends AnswerStepId = AnswerStepId>(
    steps: RenewableEnergyStepsState,
    stepId: K,
  ) {
    return this.getStep(steps, stepId)?.payload;
  },

  getDefaultAnswers<K extends AnswerStepId = AnswerStepId>(
    steps: RenewableEnergyStepsState,
    stepId: K,
  ) {
    return this.getStep(steps, stepId)?.defaultValues;
  },
};

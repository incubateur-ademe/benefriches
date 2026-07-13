import { WizardFormState } from "../../wizardForm.reducer";
import { AnswersByStep, AnswerStepId } from "../urbanProjectSteps";

export const ReadStateHelper = {
  getStep<K extends AnswerStepId = AnswerStepId>(
    steps: WizardFormState["urbanProject"]["steps"],
    stepId: K,
  ) {
    return steps[stepId] as
      | {
          completed: boolean;
          payload?: AnswersByStep[K];
          defaultValues?: AnswersByStep[K];
        }
      | undefined;
  },

  getStepAnswers<K extends AnswerStepId = AnswerStepId>(
    steps: WizardFormState["urbanProject"]["steps"],
    stepId: K,
  ) {
    return this.getStep(steps, stepId)?.payload;
  },

  getDefaultAnswers<K extends AnswerStepId = AnswerStepId>(
    steps: WizardFormState["urbanProject"]["steps"],
    stepId: K,
  ) {
    return this.getStep(steps, stepId)?.defaultValues;
  },
} as const;

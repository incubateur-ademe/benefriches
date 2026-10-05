import type { WizardFormStepsState } from "../stepHandler.type";

/**
 * Minimal sub-state MutateStateHelper operates on: just `currentStep` + `steps`. Deliberately
 * narrower than WizardFormSubState (which also carries saveState/pendingStepCompletion/
 * stepsSequence/firstSequenceStep, unused here) — a consumer's full sub-state still satisfies
 * this shape structurally, so callers can pass it as-is.
 */
export type MutableWizardFormState<StepId, TAnswers> = {
  currentStep: StepId;
  steps: WizardFormStepsState<TAnswers>;
};

export const MutateStateHelper = {
  navigateToStep<StepId, TAnswers>(form: MutableWizardFormState<StepId, TAnswers>, stepId: StepId) {
    form.currentStep = stepId;
  },

  ensureStepExists<StepId, TAnswers, K extends keyof TAnswers>(
    form: MutableWizardFormState<StepId, TAnswers>,
    stepId: K,
    defaultCompleted = false,
  ) {
    if (!form.steps[stepId]) {
      form.steps[stepId] = { completed: defaultCompleted };
    }
    return form.steps[stepId]!;
  },

  setDefaultValues<StepId, TAnswers, K extends keyof TAnswers>(
    form: MutableWizardFormState<StepId, TAnswers>,
    stepId: K,
    answers: TAnswers[K],
  ) {
    const step = this.ensureStepExists<StepId, TAnswers, K>(form, stepId);
    step.defaultValues = answers;
  },

  completeStep<StepId, TAnswers, K extends keyof TAnswers>(
    form: MutableWizardFormState<StepId, TAnswers>,
    stepId: K,
    answers: TAnswers[K],
  ) {
    const step = this.ensureStepExists<StepId, TAnswers, K>(form, stepId, true);
    step.completed = true;
    step.payload = answers;
  },

  invalidateStep<StepId, TAnswers>(
    form: MutableWizardFormState<StepId, TAnswers>,
    stepId: keyof TAnswers,
  ) {
    const step = form.steps[stepId];
    if (!step) {
      return;
    }
    step.completed = false;
    step.defaultValues = undefined;
    step.payload = undefined;
  },

  // `defaultValues` must hold the purely generated answers: handlers compare `payload` against
  // them to tell generated amounts from user edits, so storing a recomputed payload that kept
  // user edits as defaults would make those edits look generated on the next recompute.
  recomputeStep<StepId, TAnswers, K extends keyof TAnswers>(
    form: MutableWizardFormState<StepId, TAnswers>,
    stepId: K,
    answers: TAnswers[K],
    defaultValues: TAnswers[K] = answers,
  ) {
    form.steps[stepId] = {
      completed: true,
      defaultValues,
      payload: answers,
    };
  },

  deleteStep<StepId, TAnswers>(
    form: MutableWizardFormState<StepId, TAnswers>,
    stepId: keyof TAnswers,
  ) {
    const step = form.steps[stepId];
    if (!step) {
      return;
    }
    form.steps[stepId] = undefined;
  },

  completeStepFromPayload<StepId, TAnswers, K extends keyof TAnswers>(
    form: MutableWizardFormState<StepId, TAnswers>,
    payload: { stepId: K; answers: TAnswers[K] },
  ) {
    const step = this.ensureStepExists<StepId, TAnswers, K>(form, payload.stepId, true);
    step.completed = true;
    step.payload = payload.answers;
  },
};

import { ProjectFormState } from "../../projectForm.reducer";
import { AnswersByStep, AnswerStepId, UrbanProjectCreationStep } from "../urbanProjectSteps";

export const MutateStateHelper = {
  navigateToStep: (state: ProjectFormState, stepId: UrbanProjectCreationStep) => {
    state.urbanProject.currentStep = stepId;
  },

  ensureStepExists(state: ProjectFormState, stepId: AnswerStepId, defaultCompleted = false) {
    if (!state.urbanProject.steps[stepId]) {
      state.urbanProject.steps[stepId] = { completed: defaultCompleted };
    }
    return state.urbanProject.steps[stepId];
  },

  setDefaultValues<K extends AnswerStepId>(
    state: ProjectFormState,
    stepId: K,
    answers: AnswersByStep[K],
  ) {
    const step = this.ensureStepExists(state, stepId);
    step.defaultValues = answers;
  },

  completeStep<K extends AnswerStepId>(
    state: ProjectFormState,
    stepId: K,
    answers: AnswersByStep[K],
  ) {
    const step = this.ensureStepExists(state, stepId, true);
    step.completed = true;
    step.payload = answers;
  },

  invalidateStep(state: ProjectFormState, stepId: AnswerStepId) {
    const step = state.urbanProject.steps[stepId];
    if (!step) {
      return;
    }
    step.completed = false;
    step.defaultValues = undefined;
    step.payload = undefined;
  },

  recomputeStep<K extends AnswerStepId>(
    state: ProjectFormState,
    stepId: K,
    answers: AnswersByStep[K],
  ) {
    state.urbanProject.steps[stepId] = {
      completed: true,
      defaultValues: answers,
      payload: answers,
    };
  },

  deleteStep(state: ProjectFormState, stepId: AnswerStepId) {
    const step = state.urbanProject.steps[stepId];
    if (!step) {
      return;
    }
    state.urbanProject.steps[stepId] = undefined;
  },
};

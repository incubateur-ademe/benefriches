import { ProjectCreationState } from "../../createProject.reducer";
import { AnswersByStep, AnswerStepId, UrbanProjectCreationStep } from "../urbanProjectSteps";

export const MutateStateHelper = {
  navigateToStep: (state: ProjectCreationState, stepId: UrbanProjectCreationStep) => {
    state.urbanProjectBeta.currentStep = stepId;
  },

  ensureStepExists(state: ProjectCreationState, stepId: AnswerStepId, defaultCompleted = false) {
    if (!state.urbanProjectBeta.steps[stepId]) {
      state.urbanProjectBeta.steps[stepId] = { completed: defaultCompleted };
    }
    return state.urbanProjectBeta.steps[stepId];
  },

  setDefaultValues<K extends AnswerStepId>(
    state: ProjectCreationState,
    stepId: K,
    answers: AnswersByStep[K],
  ) {
    const step = this.ensureStepExists(state, stepId);
    step.defaultValues = answers;
  },

  completeStep<K extends AnswerStepId>(
    state: ProjectCreationState,
    stepId: K,
    answers: AnswersByStep[K],
  ) {
    const step = this.ensureStepExists(state, stepId, true);
    step.completed = true;
    step.payload = answers;
  },

  invalidateStep(state: ProjectCreationState, stepId: AnswerStepId) {
    const step = this.ensureStepExists(state, stepId, false);
    step.completed = false;
    step.defaultValues = undefined;
    step.payload = undefined;
  },

  recomputeStep<K extends AnswerStepId>(
    state: ProjectCreationState,
    stepId: K,
    answers: AnswersByStep[K],
  ) {
    state.urbanProjectBeta.steps[stepId] = {
      completed: true,
      defaultValues: answers,
      payload: answers,
    };
  },

  deleteStep(state: ProjectCreationState, stepId: AnswerStepId) {
    state.urbanProjectBeta.steps[stepId] = undefined;
  },
};

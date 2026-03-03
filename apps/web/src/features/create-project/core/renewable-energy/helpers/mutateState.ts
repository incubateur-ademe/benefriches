import type { ProjectCreationState } from "../../createProject.reducer";
import type {
  AnswersByStep,
  AnswerStepId,
  RenewableEnergyCreationStep,
} from "../renewableEnergySteps";

export const MutateStateHelper = {
  navigateToStep(state: ProjectCreationState, stepId: RenewableEnergyCreationStep) {
    state.renewableEnergyProject.currentStep = stepId;
  },

  ensureStepExists(state: ProjectCreationState, stepId: AnswerStepId, defaultCompleted = false) {
    if (!state.renewableEnergyProject.steps[stepId]) {
      state.renewableEnergyProject.steps[stepId] = { completed: defaultCompleted };
    }
    return state.renewableEnergyProject.steps[stepId];
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
};

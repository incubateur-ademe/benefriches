import type { SiteCreationState } from "../../createSite.reducer";
import type {
  AnswersByStep,
  SchematizedAnswerStepId,
  UrbanZoneSiteCreationStep,
} from "../urbanZoneSteps";

export const MutateStateHelper = {
  navigateToStep(state: SiteCreationState, stepId: UrbanZoneSiteCreationStep) {
    state.urbanZone.currentStep = stepId;
  },

  completeStep<K extends SchematizedAnswerStepId>(
    state: SiteCreationState,
    stepId: K,
    answers: AnswersByStep[K],
  ) {
    (state.urbanZone.steps as Record<string, unknown>)[stepId] = {
      completed: true,
      payload: answers,
    };
  },
};

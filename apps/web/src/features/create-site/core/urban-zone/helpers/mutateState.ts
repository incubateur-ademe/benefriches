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

  setDefaultAnswers<K extends SchematizedAnswerStepId>(
    state: SiteCreationState,
    stepId: K,
    defaultValues: AnswersByStep[K],
  ) {
    const existing = (state.urbanZone.steps as Record<string, unknown>)[stepId];
    (state.urbanZone.steps as Record<string, unknown>)[stepId] = {
      ...(typeof existing === "object" && existing !== null ? existing : {}),
      defaultValues,
    };
  },
};

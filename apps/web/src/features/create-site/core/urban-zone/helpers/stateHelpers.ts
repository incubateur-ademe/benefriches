import type { UrbanZoneLandParcelType } from "shared";

import type { SiteCreationState } from "../../createSite.reducer";
import type { StepCompletionPayload } from "../urban-zone.actions";
import type {
  AnswersByStep,
  SchematizedAnswerStepId,
  UrbanZoneSiteCreationStep,
  UrbanZoneStepsState,
} from "../urbanZoneSteps";

export const ReadStateHelper = {
  getStep<K extends SchematizedAnswerStepId>(steps: UrbanZoneStepsState, stepId: K) {
    return steps[stepId];
  },

  getStepAnswers<K extends SchematizedAnswerStepId>(steps: UrbanZoneStepsState, stepId: K) {
    return this.getStep(steps, stepId)?.payload;
  },

  getDefaultAnswers<K extends SchematizedAnswerStepId>(steps: UrbanZoneStepsState, stepId: K) {
    return this.getStep(steps, stepId)?.defaultValues;
  },
};

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

  // Accepts a bundled payload (discriminated union) — preserves the stepId/answers
  // correlation that is lost when destructuring union members into separate arguments.
  completeStepFromPayload(state: SiteCreationState, payload: StepCompletionPayload) {
    (state.urbanZone.steps as Record<string, unknown>)[payload.stepId] = {
      completed: true,
      payload: payload.answers,
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

export function getSelectedParcelTypes(stepsState: UrbanZoneStepsState): UrbanZoneLandParcelType[] {
  return (
    ReadStateHelper.getStepAnswers(stepsState, "URBAN_ZONE_LAND_PARCELS_SELECTION")
      ?.landParcelTypes ?? []
  );
}

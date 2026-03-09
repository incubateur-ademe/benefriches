import type { UrbanZoneLandParcelType } from "shared";

import type { SiteCreationState } from "../../createSite.reducer";
import type {
  AnswersByStep,
  SchematizedAnswerStepId,
  UrbanZoneSiteCreationStep,
  UrbanZoneStepsState,
} from "../urbanZoneSteps";

export const ReadStateHelper = {
  getStep<K extends SchematizedAnswerStepId>(steps: UrbanZoneStepsState, stepId: K) {
    return steps[stepId] as
      | {
          completed: boolean;
          payload?: AnswersByStep[K];
          defaultValues?: AnswersByStep[K];
        }
      | undefined;
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

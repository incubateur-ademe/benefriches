import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "@/shared/core/store-config/store";

import { FormEvent } from "./form-events/FormEvent.type";
import { FormState } from "./form-state/formState";
import { isInformationalStep, AnswerStepId } from "./urbanProjectSteps";

const selectEvents = (state: RootState) => state.projectCreation.urbanProjectEventSourcing.events;

export const selectProjectSoilDistribution = createSelector(selectEvents, (events: FormEvent[]) =>
  FormState.getProjectSoilDistribution(events),
);

export const selectStepAnswers = <T extends AnswerStepId>(stepId: T) =>
  createSelector([selectEvents], (events) => {
    if (isInformationalStep(stepId)) {
      return undefined;
    }
    return FormState.getStepAnswers(events, stepId);
  });

export const selectHasBuildings = createSelector([selectEvents], (events) =>
  FormState.hasBuildings(events),
);

export const selectProjectData = createSelector([selectEvents], (events) =>
  FormState.getProjectData(events),
);

export const selectProjectSpaces = createSelector([selectEvents], (events) =>
  FormState.getSpacesDistribution(events),
);

export const selectFormAnswers = createSelector([selectEvents], (events) =>
  FormState.getAllFormAnswers(events),
);

export const selectCurrentStep = createSelector(
  [(state: RootState) => state.projectCreation.urbanProjectEventSourcing],
  (state) => state.currentStep,
);

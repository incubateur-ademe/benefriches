import { createReducer } from "@reduxjs/toolkit";

import type { SiteCreationState } from "../createSite.reducer";
import { applyStepChanges, computeStepChanges } from "./completeStep";
import { navigateToAndLoadStep } from "./navigateToStep";
import { urbanZoneStepHandlerRegistry } from "./stepHandlerRegistry";
import {
  nextStepRequested,
  previousStepRequested,
  stepCompletionRequested,
} from "./urban-zone.actions";

// Sub-reducer composed via reduce-reducers in createSite.reducer.ts.
// Initial state is always provided by the parent reducer; this placeholder is never used.
export const urbanZoneSiteCreationReducer = createReducer({} as SiteCreationState, (builder) => {
  builder.addCase(stepCompletionRequested, (state, action) => {
    const changes = computeStepChanges(state, action.payload);
    applyStepChanges(state, changes);
  });

  // For info steps (intros, summaries) that only need forward navigation
  builder.addCase(nextStepRequested, (state) => {
    const currentStep = state.urbanZone.currentStep;
    const handler = urbanZoneStepHandlerRegistry[currentStep];
    if (!handler?.getNextStepId) return;

    const context = {
      siteData: state.siteData,
      stepsState: state.urbanZone.steps,
    };
    const nextStep = handler.getNextStepId(context);
    navigateToAndLoadStep(state, nextStep);
  });

  builder.addCase(previousStepRequested, (state) => {
    const currentStep = state.urbanZone.currentStep;
    const handler = urbanZoneStepHandlerRegistry[currentStep];

    if (handler?.getPreviousStepId) {
      const context = {
        siteData: state.siteData,
        stepsState: state.urbanZone.steps,
      };
      const previousStep = handler.getPreviousStepId(context);
      navigateToAndLoadStep(state, previousStep);
      return;
    }

    // Use stepsSequence for backward navigation
    const stepsSequence = state.urbanZone.stepsSequence;
    const currentIndex = stepsSequence.indexOf(currentStep);
    const previousStep = currentIndex > 0 ? stepsSequence[currentIndex - 1] : undefined;

    if (previousStep) {
      navigateToAndLoadStep(state, previousStep);
    } else if (state.stepsHistory.length > 1) {
      // Fall back to stepsHistory when at the first step of the sequence
      state.stepsHistory = state.stepsHistory.slice(0, -1);
    }
  });
});

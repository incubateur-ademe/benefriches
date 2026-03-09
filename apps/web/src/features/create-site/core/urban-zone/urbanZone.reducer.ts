import { createReducer } from "@reduxjs/toolkit";

import type { SiteCreationState } from "../createSite.reducer";
import { navigateToAndLoadStep } from "./helpers/navigateToStep";
import { urbanZoneStepHandlerRegistry } from "./step-handlers/stepHandlerRegistry";
import { previousStepRequested } from "./urban-zone.actions";

// Sub-reducer composed via reduce-reducers in createSite.reducer.ts.
// Initial state is always provided by the parent reducer; this placeholder is never used.
// stepCompletionRequested will be added in Phase 3 when the first answer step schema is registered.
export const urbanZoneSiteCreationReducer = createReducer({} as SiteCreationState, (builder) => {
  builder.addCase(previousStepRequested, (state) => {
    const currentStep = state.urbanZone.currentStep;
    const handler = urbanZoneStepHandlerRegistry[currentStep];

    if (handler?.getPreviousStepId) {
      const context = {
        siteData: state.siteData,
        stepsState: state.urbanZone.steps,
        landParcels: state.urbanZone.landParcels,
        currentLandParcelIndex: state.urbanZone.currentLandParcelIndex,
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

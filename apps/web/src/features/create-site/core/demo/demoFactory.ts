import { createReducer } from "@reduxjs/toolkit";

import type { SiteCreationState } from "../createSite.reducer";
import { createDemoFormActions } from "./demo.actions";
import { addDemoFormCasesToBuilder } from "./demoForm.reducer";
import { demoSiteSaved } from "./demoSiteSaved.action";

export { ReadStateHelper } from "@/shared/core/wizard-form/helpers/readState";

const demoFormActions = createDemoFormActions("siteCreation/demo");

export const {
  stepCompletionRequested,
  stepCompletionConfirmed,
  stepCompletionCancelled,
  previousStepRequested,
  nextStepRequested,
  stepNavigationRequested,
} = demoFormActions;

export const demoSiteCreationReducer = createReducer({} as SiteCreationState, (builder) => {
  addDemoFormCasesToBuilder(builder, demoFormActions, {
    config: {
      stepChangesNextMode: "step_order",
      finalSummaryFallbackStep: "DEMO_CREATION_RESULT",
      onPreviousStepFallback: (state) => {
        if (state.stepsHistory.length > 1) {
          state.stepsHistory = state.stepsHistory.slice(0, -1);
        }
      },
    },
    selectForm: (state) => state.demo,
    buildContext: (state) => ({ siteData: state.siteData }),
  });

  builder.addCase(demoSiteSaved.pending, (state) => {
    state.demo.saveState = "loading";
  });
  builder.addCase(demoSiteSaved.fulfilled, (state) => {
    state.demo.saveState = "success";
  });
  builder.addCase(demoSiteSaved.rejected, (state) => {
    state.demo.saveState = "error";
  });
});

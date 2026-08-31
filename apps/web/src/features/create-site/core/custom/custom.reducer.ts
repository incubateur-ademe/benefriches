import { createReducer } from "@reduxjs/toolkit";

import type { SiteCreationState } from "../createSite.reducer";
import { customFormActions } from "./custom.actions";
import { addCustomFormCasesToBuilder, CustomWizardFormDefinition } from "./customForm.reducer";
import { deriveSiteDataFromCustomSteps } from "./customSteps";
import { addLegacyCustomActionsToBuilder } from "./legacyActionsAdapter";

export const customFormDefinition: CustomWizardFormDefinition = {
  config: {
    stepChangesNextMode: "step_order",
    finalSummaryFallbackStep: "FINAL_SUMMARY",
    onPreviousStepFallback: (state) => {
      // Backing out of the custom engine's very first step (whichever nature's activity step
      // that is) leaves the engine entirely, back to the pre-engine SITE_NATURE/IS_FRICHE
      // step still sitting atop stepsHistory (see createSite.reducer.ts).
      state.customFlowStarted = false;
    },
  },
  selectForm: (state) => state.custom,
  buildContext: (state) => ({
    siteData: deriveSiteDataFromCustomSteps(
      { ...state.initialSiteData, isFriche: state.isFriche, nature: state.nature },
      state.custom.steps,
    ),
  }),
};

// Sub-reducer composed via reduce-reducers in createSite.reducer.ts.
// Initial state is always provided by the parent reducer; this placeholder is never used.
export const customSiteCreationReducer = createReducer({} as SiteCreationState, (builder) => {
  addCustomFormCasesToBuilder(builder, customFormActions, customFormDefinition);
  // Legacy per-step actions (`fricheActivityStepCompleted`, `addressStepCompleted`, ...) are
  // kept alive as thin aliases onto the same engine path — the ticket-02 behaviour-net oracle
  // dispatches them directly and must pass unmodified. See legacyActionsAdapter.ts.
  addLegacyCustomActionsToBuilder(builder, customFormDefinition);
});

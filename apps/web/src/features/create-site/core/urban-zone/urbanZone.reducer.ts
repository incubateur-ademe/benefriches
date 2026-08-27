import { createReducer } from "@reduxjs/toolkit";

import type { SiteCreationState } from "../createSite.reducer";
import { urbanZoneFormActions } from "./urban-zone.actions";
import { addUrbanZoneFormCasesToBuilder } from "./urbanZoneForm.reducer";

// Sub-reducer composed via reduce-reducers in createSite.reducer.ts.
// Initial state is always provided by the parent reducer; this placeholder is never used.
export const urbanZoneSiteCreationReducer = createReducer({} as SiteCreationState, (builder) => {
  addUrbanZoneFormCasesToBuilder(builder, urbanZoneFormActions, {
    config: {
      stepChangesNextMode: "step_order",
      finalSummaryFallbackStep: "URBAN_ZONE_CREATION_RESULT",
      onPreviousStepFallback: (state) => {
        if (state.stepsHistory.length > 1) {
          state.stepsHistory = state.stepsHistory.slice(0, -1);
        }
      },
    },
    selectForm: (state) => state.urbanZone,
    buildContext: (state) => ({ siteData: state.siteData }),
  });
});

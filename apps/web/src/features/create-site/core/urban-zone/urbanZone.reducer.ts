import { createReducer } from "@reduxjs/toolkit";

import type { SiteCreationState } from "../createSite.reducer";
import { deriveSiteDataFromCustomSteps } from "../custom/customSteps";
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
        // Backing out of the urban-zone sub-flow's own first step hands control back to the
        // custom engine's SURFACE_AREA step (where the hand-off happened) — see
        // custom/customForm.reducer.ts.
        state.customHandedOffToUrbanZone = false;
      },
    },
    selectForm: (state) => state.urbanZone,
    buildContext: (state) => ({
      siteData: deriveSiteDataFromCustomSteps(
        { ...state.initialSiteData, isFriche: state.isFriche, nature: state.nature },
        state.custom.steps,
      ),
    }),
  });
});

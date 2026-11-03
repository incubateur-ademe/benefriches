import type { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import type { SiteNature } from "shared";

import type { SiteCreationCustomStep } from "../../createSite.reducer";
import type { SiteCreationState } from "../../createSite.reducer";
import { getInitialState } from "../../createSite.reducer";
import {
  createModeSelectionCompleted,
  impactsIntroductionStepCompleted,
  introductionStepCompleted,
  isFricheCompleted,
  mutabilityOrImpactsSelectionCompleted,
  siteCreationInitiated,
  siteNatureCompleted,
} from "./introduction.actions";

/**
 * Hands the flow off from the pre-engine steps to the custom wizard-form engine's first step:
 * seeds both `currentStep` and `firstSequenceStep` (the custom flow has four possible entry
 * steps, one per nature — see createSite.reducer.ts) and flips `customFlowStarted`, which is
 * what `selectCurrentStep` gates on.
 */
const enterCustomFlow = (state: SiteCreationState, firstStep: SiteCreationCustomStep): void => {
  state.customFlowStarted = true;
  state.custom.currentStep = firstStep;
  state.custom.firstSequenceStep = firstStep;
};

const FIRST_CUSTOM_STEP_BY_NATURE = {
  FRICHE: "FRICHE_ACTIVITY",
  AGRICULTURAL_OPERATION: "AGRICULTURAL_OPERATION_ACTIVITY",
  NATURAL_AREA: "NATURAL_AREA_TYPE",
  URBAN_ZONE: "URBAN_ZONE_TYPE",
} as const satisfies Record<SiteNature, SiteCreationCustomStep>;

export const registerIntroductionHandlers = (
  builder: ActionReducerMapBuilder<SiteCreationState>,
): void => {
  builder
    .addCase(siteCreationInitiated, (_state, action) => {
      return getInitialState({
        skipUseMutability: action.payload?.evaluationMode === "impacts",
        createMode: action.payload?.createMode,
      });
    })
    .addCase(introductionStepCompleted, (state) => {
      state.stepsHistory.push("IS_FRICHE");
    })
    .addCase(isFricheCompleted, (state, action) => {
      const { isFriche } = action.payload;
      state.isFriche = isFriche;
      if (isFriche) {
        state.nature = "FRICHE";
        if (state.skipUseMutability) {
          state.stepsHistory.push("IMPACTS_INTRODUCTION");
        } else {
          state.stepsHistory.push("USE_MUTABILITY");
        }
      } else {
        state.stepsHistory.push("SITE_NATURE");
      }
    })
    .addCase(mutabilityOrImpactsSelectionCompleted, (state, action) => {
      state.useMutability = action.payload.useMutability;
      if (!action.payload.useMutability) {
        state.stepsHistory.push("IMPACTS_INTRODUCTION");
      }
    })
    .addCase(siteNatureCompleted, (state, action) => {
      state.nature = action.payload.nature;
      state.stepsHistory.push("IMPACTS_INTRODUCTION");
    })
    // Last pre-engine screen: the hand-off into the custom engine happens here, on the first
    // step of the nature answered by IS_FRICHE or SITE_NATURE.
    .addCase(impactsIntroductionStepCompleted, (state) => {
      if (!state.nature) throw new Error("IMPACTS_INTRODUCTION reached without a site nature");
      enterCustomFlow(state, FIRST_CUSTOM_STEP_BY_NATURE[state.nature]);
    })
    .addCase(createModeSelectionCompleted, (state, action) => {
      state.createMode = action.payload.createMode;
      state.stepsHistory.push("INTRODUCTION");
    });
};

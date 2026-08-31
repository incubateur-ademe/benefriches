import type { ActionReducerMapBuilder } from "@reduxjs/toolkit";

import type { SiteCreationCustomStep } from "../../createSite.reducer";
import type { SiteCreationState } from "../../createSite.reducer";
import { getInitialState } from "../../createSite.reducer";
import {
  createModeSelectionCompleted,
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
          enterCustomFlow(state, "FRICHE_ACTIVITY");
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
        enterCustomFlow(state, "FRICHE_ACTIVITY");
      }
    })
    .addCase(siteNatureCompleted, (state, action) => {
      state.nature = action.payload.nature;
      switch (action.payload.nature) {
        case "FRICHE":
          enterCustomFlow(state, "FRICHE_ACTIVITY");
          break;
        case "AGRICULTURAL_OPERATION":
          enterCustomFlow(state, "AGRICULTURAL_OPERATION_ACTIVITY");
          break;
        case "NATURAL_AREA":
          enterCustomFlow(state, "NATURAL_AREA_TYPE");
          break;
        case "URBAN_ZONE":
          enterCustomFlow(state, "URBAN_ZONE_TYPE");
          break;
        default:
          break;
      }
    })
    .addCase(createModeSelectionCompleted, (state, action) => {
      state.createMode = action.payload.createMode;
      state.stepsHistory.push("INTRODUCTION");
    });
};

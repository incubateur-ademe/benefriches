import type { ActionReducerMapBuilder } from "@reduxjs/toolkit";

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
      const answeredStep = state.stepsHistory.at(-1);

      state.siteData.isFriche = isFriche;
      if (isFriche) {
        state.siteData.nature = "FRICHE";
        if (answeredStep) {
          state.answers[answeredStep] = { isFriche, nature: "FRICHE" };
        }
        state.stepsHistory.push(state.skipUseMutability ? "FRICHE_ACTIVITY" : "USE_MUTABILITY");
      } else {
        if (answeredStep) {
          state.answers[answeredStep] = { isFriche };
        }
        state.stepsHistory.push("SITE_NATURE");
      }
    })
    .addCase(mutabilityOrImpactsSelectionCompleted, (state, action) => {
      state.useMutability = action.payload.useMutability;
      if (!action.payload.useMutability) {
        state.stepsHistory.push("FRICHE_ACTIVITY");
      }
    })
    .addCase(siteNatureCompleted, (state, action) => {
      const answeredStep = state.stepsHistory.at(-1);
      state.siteData.nature = action.payload.nature;
      if (answeredStep) {
        state.answers[answeredStep] = { nature: action.payload.nature };
      }
      switch (action.payload.nature) {
        case "FRICHE":
          state.stepsHistory.push("FRICHE_ACTIVITY");
          break;
        case "AGRICULTURAL_OPERATION":
          state.stepsHistory.push("AGRICULTURAL_OPERATION_ACTIVITY");
          break;
        case "NATURAL_AREA":
          state.stepsHistory.push("NATURAL_AREA_TYPE");
          break;
        case "URBAN_ZONE":
          state.stepsHistory.push("URBAN_ZONE_TYPE");
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

export const revertIntroductionStep = (state: SiteCreationState): void => {
  const revertedStep = state.stepsHistory.at(-1);
  switch (revertedStep) {
    case "IS_FRICHE":
      state.siteData.isFriche = undefined;
      state.answers[revertedStep] = undefined;
      break;
    case "SITE_NATURE":
      state.siteData.nature = undefined;
      state.answers[revertedStep] = undefined;
      break;
  }
};

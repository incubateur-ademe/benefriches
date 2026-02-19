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
        initialStep: action.payload?.skipIntroduction ? "IS_FRICHE" : "INTRODUCTION",
        skipUseMutability: action.payload?.skipUseMutability,
      });
    })
    .addCase(introductionStepCompleted, (state) => {
      state.stepsHistory.push("IS_FRICHE");
    })
    .addCase(isFricheCompleted, (state, action) => {
      const { isFriche } = action.payload;

      state.siteData.isFriche = isFriche;
      if (isFriche) {
        state.siteData.nature = "FRICHE";
        state.stepsHistory.push(
          state.skipUseMutability ? "CREATE_MODE_SELECTION" : "USE_MUTABILITY",
        );
      } else {
        state.stepsHistory.push("SITE_NATURE");
      }
    })
    .addCase(mutabilityOrImpactsSelectionCompleted, (state, action) => {
      state.useMutability = action.payload.useMutability;
      if (!action.payload.useMutability) {
        state.stepsHistory.push("CREATE_MODE_SELECTION");
      }
    })
    .addCase(siteNatureCompleted, (state, action) => {
      state.siteData.nature = action.payload.nature;
      state.stepsHistory.push("CREATE_MODE_SELECTION");
    })
    .addCase(createModeSelectionCompleted, (state, action) => {
      const { createMode } = action.payload;
      state.createMode = createMode;

      switch (state.siteData.nature) {
        case "FRICHE":
          state.stepsHistory.push("FRICHE_ACTIVITY");
          break;
        case "AGRICULTURAL_OPERATION":
          state.stepsHistory.push("AGRICULTURAL_OPERATION_ACTIVITY");
          break;
        case "NATURAL_AREA":
          state.stepsHistory.push("NATURAL_AREA_TYPE");
          break;
        default:
          break;
      }
    });
};

export const revertIntroductionStep = (state: SiteCreationState): void => {
  switch (state.stepsHistory.at(-1)) {
    case "IS_FRICHE":
      state.siteData.isFriche = undefined;
      break;
    case "SITE_NATURE":
      state.siteData.nature = undefined;
      break;
  }
};

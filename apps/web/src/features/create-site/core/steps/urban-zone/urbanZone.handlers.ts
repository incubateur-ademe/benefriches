import type { ActionReducerMapBuilder } from "@reduxjs/toolkit";

import type { SiteCreationState } from "../../createSite.reducer";
import {
  urbanZoneLandParcelsIntroductionCompleted,
  urbanZoneTypeCompleted,
} from "./urbanZone.actions";

export const registerUrbanZoneHandlers = (
  builder: ActionReducerMapBuilder<SiteCreationState>,
): void => {
  builder
    .addCase(urbanZoneTypeCompleted, (state, action) => {
      const answeredStep = state.stepsHistory.at(-1);
      state.siteData.urbanZoneType = action.payload.urbanZoneType;
      state.createMode = "custom";
      if (answeredStep) {
        state.answers[answeredStep] = { urbanZoneType: action.payload.urbanZoneType };
      }
      state.stepsHistory.push("ADDRESS");
    })
    .addCase(urbanZoneLandParcelsIntroductionCompleted, (state) => {
      state.stepsHistory.push("SURFACE_AREA");
    });
};

export const revertUrbanZoneStep = (state: SiteCreationState): void => {
  const revertedStep = state.stepsHistory.at(-1);
  switch (revertedStep) {
    case "URBAN_ZONE_TYPE":
      state.siteData.urbanZoneType = undefined;
      state.answers[revertedStep] = undefined;
      break;
  }
};

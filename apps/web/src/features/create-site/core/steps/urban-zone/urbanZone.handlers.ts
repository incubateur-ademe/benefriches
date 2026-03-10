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
      state.siteData.urbanZoneType = action.payload.urbanZoneType;
      state.stepsHistory.push("CREATE_MODE_SELECTION");
    })
    .addCase(urbanZoneLandParcelsIntroductionCompleted, (state) => {
      state.stepsHistory.push("SURFACE_AREA");
    });
};

export const revertUrbanZoneStep = (state: SiteCreationState): void => {
  switch (state.stepsHistory.at(-1)) {
    case "URBAN_ZONE_TYPE":
      state.siteData.urbanZoneType = undefined;
      break;
  }
};

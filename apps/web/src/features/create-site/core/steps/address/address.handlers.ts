import type { ActionReducerMapBuilder } from "@reduxjs/toolkit";

import type { SiteCreationState } from "../../createSite.reducer";
import { addressStepCompleted } from "./address.actions";

export const registerAddressHandlers = (
  builder: ActionReducerMapBuilder<SiteCreationState>,
): void => {
  builder.addCase(addressStepCompleted, (state, action) => {
    state.siteData.address = action.payload.address;
    if (state.siteData.nature === "URBAN_ZONE") {
      state.stepsHistory.push("URBAN_ZONE_LAND_PARCELS_INTRODUCTION");
    } else if (state.createMode === "express") {
      state.stepsHistory.push("SURFACE_AREA");
    } else {
      state.stepsHistory.push("SPACES_INTRODUCTION");
    }
  });
};

export const revertAddressStep = (state: SiteCreationState): void => {
  switch (state.stepsHistory.at(-1)) {
    case "ADDRESS":
      state.siteData.address = undefined;
      break;
  }
};

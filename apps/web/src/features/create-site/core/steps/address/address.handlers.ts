import type { ActionReducerMapBuilder } from "@reduxjs/toolkit";

import type { SiteCreationState } from "../../createSite.reducer";
import { addressStepCompleted } from "./address.actions";

export const registerAddressHandlers = (
  builder: ActionReducerMapBuilder<SiteCreationState>,
): void => {
  builder.addCase(addressStepCompleted, (state, action) => {
    const answeredStep = state.stepsHistory.at(-1);
    state.siteData.address = action.payload.address;
    if (answeredStep) {
      state.answers[answeredStep] = { address: action.payload.address };
    }
    if (state.siteData.nature === "URBAN_ZONE") {
      state.stepsHistory.push("URBAN_ZONE_LAND_PARCELS_INTRODUCTION");
    } else {
      state.stepsHistory.push("SPACES_INTRODUCTION");
    }
  });
};

export const revertAddressStep = (state: SiteCreationState): void => {
  const revertedStep = state.stepsHistory.at(-1);
  switch (revertedStep) {
    case "ADDRESS":
      state.siteData.address = undefined;
      state.answers[revertedStep] = undefined;
      break;
  }
};

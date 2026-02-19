import type { ActionReducerMapBuilder } from "@reduxjs/toolkit";

import type { SiteCreationState } from "../../createSite.reducer";
import { addressStepCompleted } from "./address.actions";

export const registerAddressHandlers = (
  builder: ActionReducerMapBuilder<SiteCreationState>,
): void => {
  builder.addCase(addressStepCompleted, (state, action) => {
    state.siteData.address = action.payload.address;
    state.stepsHistory.push(
      state.createMode === "express" ? "SURFACE_AREA" : "SPACES_INTRODUCTION",
    );
  });
};

export const revertAddressStep = (state: SiteCreationState): void => {
  switch (state.stepsHistory.at(-1)) {
    case "ADDRESS":
      state.siteData.address = undefined;
      break;
  }
};

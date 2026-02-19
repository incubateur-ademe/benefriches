import type { ActionReducerMapBuilder } from "@reduxjs/toolkit";

import type { SiteCreationState } from "../../createSite.reducer";
import { namingIntroductionStepCompleted, namingStepCompleted } from "./naming.actions";

export const registerNamingHandlers = (
  builder: ActionReducerMapBuilder<SiteCreationState>,
): void => {
  builder
    .addCase(namingIntroductionStepCompleted, (state) => {
      state.stepsHistory.push("NAMING");
    })
    .addCase(namingStepCompleted, (state, action) => {
      state.siteData.name = action.payload.name;

      if (action.payload.description) state.siteData.description = action.payload.description;

      state.stepsHistory.push("FINAL_SUMMARY");
    });
};

export const revertNamingStep = (state: SiteCreationState): void => {
  switch (state.stepsHistory.at(-1)) {
    case "NAMING":
      state.siteData.name = undefined;
      state.siteData.description = undefined;
      break;
  }
};

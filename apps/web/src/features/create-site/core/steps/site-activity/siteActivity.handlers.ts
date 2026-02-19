import type { ActionReducerMapBuilder } from "@reduxjs/toolkit";

import type { SiteCreationState } from "../../createSite.reducer";
import {
  agriculturalOperationActivityCompleted,
  fricheActivityStepCompleted,
  naturalAreaTypeCompleted,
} from "./siteActivity.actions";

export const registerSiteActivityHandlers = (
  builder: ActionReducerMapBuilder<SiteCreationState>,
): void => {
  builder
    .addCase(fricheActivityStepCompleted, (state, action) => {
      state.siteData.fricheActivity = action.payload;
      state.stepsHistory.push("ADDRESS");
    })
    .addCase(agriculturalOperationActivityCompleted, (state, action) => {
      state.siteData.agriculturalOperationActivity = action.payload.activity;
      state.stepsHistory.push("ADDRESS");
    })
    .addCase(naturalAreaTypeCompleted, (state, action) => {
      state.siteData.naturalAreaType = action.payload.naturalAreaType;
      state.stepsHistory.push("ADDRESS");
    });
};

export const revertSiteActivityStep = (state: SiteCreationState): void => {
  switch (state.stepsHistory.at(-1)) {
    case "FRICHE_ACTIVITY":
      state.createMode = undefined;
      state.siteData.fricheActivity = undefined;
      break;
    case "AGRICULTURAL_OPERATION_ACTIVITY":
      state.createMode = undefined;
      state.siteData.agriculturalOperationActivity = undefined;
      break;
    case "NATURAL_AREA_TYPE":
      state.createMode = undefined;
      state.siteData.naturalAreaType = undefined;
      break;
  }
};

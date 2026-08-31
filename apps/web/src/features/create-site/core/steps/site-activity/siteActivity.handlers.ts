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
      const answeredStep = state.stepsHistory.at(-1);
      state.siteData.fricheActivity = action.payload;
      if (answeredStep) {
        state.answers[answeredStep] = { fricheActivity: action.payload };
      }
      state.stepsHistory.push("ADDRESS");
    })
    .addCase(agriculturalOperationActivityCompleted, (state, action) => {
      const answeredStep = state.stepsHistory.at(-1);
      state.siteData.agriculturalOperationActivity = action.payload.activity;
      if (answeredStep) {
        state.answers[answeredStep] = { agriculturalOperationActivity: action.payload.activity };
      }
      state.stepsHistory.push("ADDRESS");
    })
    .addCase(naturalAreaTypeCompleted, (state, action) => {
      const answeredStep = state.stepsHistory.at(-1);
      state.siteData.naturalAreaType = action.payload.naturalAreaType;
      if (answeredStep) {
        state.answers[answeredStep] = { naturalAreaType: action.payload.naturalAreaType };
      }
      state.stepsHistory.push("ADDRESS");
    });
};

export const revertSiteActivityStep = (state: SiteCreationState): void => {
  const revertedStep = state.stepsHistory.at(-1);
  switch (revertedStep) {
    case "FRICHE_ACTIVITY":
      state.siteData.fricheActivity = undefined;
      state.answers[revertedStep] = undefined;
      break;
    case "AGRICULTURAL_OPERATION_ACTIVITY":
      state.siteData.agriculturalOperationActivity = undefined;
      state.answers[revertedStep] = undefined;
      break;
    case "NATURAL_AREA_TYPE":
      state.siteData.naturalAreaType = undefined;
      state.answers[revertedStep] = undefined;
      break;
  }
};

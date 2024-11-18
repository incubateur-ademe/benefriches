import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "@/app/application/store";

import { getEnvironmentalProjectImpacts } from "../domain/projectImpactsEnvironmental";
import { ProjectImpactsState } from "./projectImpacts.reducer";

const selectSelf = (state: RootState) => state.projectImpacts;

const selectImpactsData = createSelector(
  selectSelf,
  (state): ProjectImpactsState["impactsData"] => state.impactsData,
);

export const selectEnvironmentalProjectImpacts = createSelector(
  selectImpactsData,
  getEnvironmentalProjectImpacts,
);

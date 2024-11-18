import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "@/app/application/store";

import { getSocialProjectImpacts } from "../domain/projectImpactsSocial";
import { ProjectImpactsState } from "./projectImpacts.reducer";

const selectSelf = (state: RootState) => state.projectImpacts;

const selectImpactsData = createSelector(
  selectSelf,
  (state): ProjectImpactsState["impactsData"] => state.impactsData,
);

export const getSocialProjectImpactsSelector = createSelector(
  selectImpactsData,
  getSocialProjectImpacts,
);

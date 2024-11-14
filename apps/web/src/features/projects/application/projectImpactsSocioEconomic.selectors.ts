import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "@/app/application/store";

import {
  getDetailedSocioEconomicProjectImpacts,
  getSocioEconomicProjectImpactsByActor,
} from "../domain/projectImpactsSocioEconomic";
import { ProjectImpactsState } from "./projectImpacts.reducer";

const selectSelf = (state: RootState) => state.projectImpacts;

const selectImpactsData = createSelector(
  selectSelf,
  (state): ProjectImpactsState["impactsData"] => state.impactsData,
);

const selectCurrentFilter = createSelector(
  selectSelf,
  (state): ProjectImpactsState["currentCategoryFilter"] => state.currentCategoryFilter,
);

export const getDetailedSocioEconomicProjectImpactsSelector = createSelector(
  selectCurrentFilter,
  selectImpactsData,
  getDetailedSocioEconomicProjectImpacts,
);

export const getSocioEconomicProjectImpactsByActorSelector = createSelector(
  selectCurrentFilter,
  selectImpactsData,
  getSocioEconomicProjectImpactsByActor,
);

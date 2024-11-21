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

export const selectDetailedSocioEconomicProjectImpacts = createSelector(
  selectImpactsData,
  getDetailedSocioEconomicProjectImpacts,
);

export const selectTotalSocioEconomicImpact = createSelector(
  selectImpactsData,
  (impacts): number => {
    return impacts?.socioeconomic.total ?? 0;
  },
);

export const selectSocioEconomicProjectImpactsByActor = createSelector(
  selectImpactsData,
  getSocioEconomicProjectImpactsByActor,
);

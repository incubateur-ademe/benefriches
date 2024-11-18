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

export const getDetailedSocioEconomicProjectImpactsSelector = createSelector(
  selectImpactsData,
  getDetailedSocioEconomicProjectImpacts,
);

export const getSocioEconomicProjectImpactsByActorSelector = createSelector(
  selectImpactsData,
  getSocioEconomicProjectImpactsByActor,
);

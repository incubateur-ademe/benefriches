import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "@/shared/core/store-config/store";

import { getEconomicBalanceProjectImpacts } from "../../domain/projectImpactsEconomicBalance";
import { ProjectDevelopmentPlanType } from "../../domain/projects.types";
import { ProjectImpactsState } from "./projectImpacts.reducer";

const selectSelf = (state: RootState) => state.projectImpacts;

const selectImpactsData = createSelector(
  selectSelf,
  (state): ProjectImpactsState["impactsData"] => state.impactsData,
);

const selectProjectDevelopmentType = createSelector(
  selectSelf,
  (state): ProjectDevelopmentPlanType =>
    state.projectData?.developmentPlan.type ?? "PHOTOVOLTAIC_POWER_PLANT",
);

export const selectEconomicBalanceProjectImpacts = createSelector(
  selectProjectDevelopmentType,
  selectImpactsData,
  getEconomicBalanceProjectImpacts,
);

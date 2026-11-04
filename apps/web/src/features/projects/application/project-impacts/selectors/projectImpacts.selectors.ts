import { createSelector } from "@reduxjs/toolkit";
import type { ReconversionStakeholders, GetReconversionProjectImpactsResultDto } from "shared";
import { cropImpactsByEvaluationPeriod } from "shared";

import type { RootState } from "@/app/store/store";
import { selectAppSettings } from "@/features/app-settings/core/appSettings";
import {
  buildEconomicBalanceListView,
  type EconomicBalanceByCategory,
} from "@/features/projects/core/projectImpactsEconomicBalance";
import {
  groupEnvironmentalMetricsByListViewCategory,
  type EnvironmentalImpactMetricsByListViewCategory,
} from "@/features/projects/core/projectImpactsEnvironmental";
import {
  groupSocialMetricsByListViewCategory,
  type SocialImpactMetricsByListViewCategory,
} from "@/features/projects/core/projectImpactsSocial";
import {
  getSocioEconomicProjectImpactsGroupedByCategory,
  type SocioEconomicImpactsByBearerListView,
} from "@/features/projects/core/projectImpactsSocioEconomic";
import type { ProjectDevelopmentPlanType } from "@/features/projects/core/projects.types";

import { type ProjectImpactsState } from "../projectImpacts.reducer";

const selectProjectImpactsState = (state: RootState) => state.projectImpacts;

export const selectImpactsContextData = createSelector(
  selectProjectImpactsState,
  (state): ProjectImpactsState["contextData"] => state.contextData,
);

const selectStakeholders = createSelector(
  selectProjectImpactsState,
  (state): ReconversionStakeholders | undefined => state.impacts?.stakeholders,
);

export const selectImpactsCroppedByEvaluationPeriod = createSelector(
  [selectProjectImpactsState],
  (state) =>
    state.impacts
      ? cropImpactsByEvaluationPeriod(state.impacts, state.evaluationPeriod ?? 50)
      : undefined,
);

export const selectSocialProjectImpacts = createSelector(
  [selectImpactsCroppedByEvaluationPeriod, selectImpactsContextData],
  (impacts, contextData) =>
    groupSocialMetricsByListViewCategory(
      impacts?.aggregatedReconversionImpacts.impactsMetrics ?? [],
      contextData?.projectDevelopmentPlan.type ?? "URBAN_PROJECT",
    ),
);

export const selectEnvironmentalProjectImpacts = createSelector(
  [selectImpactsCroppedByEvaluationPeriod, selectImpactsContextData],
  (impacts, contextData) =>
    groupEnvironmentalMetricsByListViewCategory(impacts, contextData?.siteSurfaceArea),
);

export const selectSocioEconomicProjectImpactsListView = createSelector(
  [selectImpactsCroppedByEvaluationPeriod, selectStakeholders],
  (impacts, stakeholers) =>
    getSocioEconomicProjectImpactsGroupedByCategory(
      impacts?.aggregatedReconversionImpacts.indirectEconomicImpacts,
      stakeholers,
    ),
);

const selectProjectDevelopmentType = createSelector(
  selectProjectImpactsState,
  (state): ProjectDevelopmentPlanType =>
    state.contextData?.projectDevelopmentPlan.type ?? "PHOTOVOLTAIC_POWER_PLANT",
);

export const selectEconomicBalanceProjectImpacts = createSelector(
  selectProjectDevelopmentType,
  selectImpactsCroppedByEvaluationPeriod,
  buildEconomicBalanceListView,
);

export const selectDisplayImpactsAccuracyDisclaimer = createSelector(
  [selectProjectImpactsState, selectAppSettings],
  (state, appSettings): boolean => {
    const isExpressProject = !!state.contextData?.isExpressProject;
    const isExpressSite = !!state.contextData?.isExpressSite;
    return (isExpressProject || isExpressSite) && appSettings.displayImpactsAccuracyDisclaimer;
  },
);

type ImpactsDescriptionModalsDataView = {
  contextData: GetReconversionProjectImpactsResultDto["contextData"];
  impactsData: GetReconversionProjectImpactsResultDto["impacts"];
  projectEconomicBalance: EconomicBalanceByCategory;
  economicImpactsByBearerAndCategory: SocioEconomicImpactsByBearerListView;
  environmentalMetricsByCategory: EnvironmentalImpactMetricsByListViewCategory;
  socialMetricsByCategory: SocialImpactMetricsByListViewCategory;
};

export const selectImpactsDescriptionModalsDataView = createSelector(
  [
    selectImpactsContextData,
    selectImpactsCroppedByEvaluationPeriod,
    selectEconomicBalanceProjectImpacts,
    selectEnvironmentalProjectImpacts,
    selectSocialProjectImpacts,
    selectSocioEconomicProjectImpactsListView,
  ],
  (
    contextData,
    impactsData,
    projectEconomicBalance,
    impactEnvironmentalMetricsByCategory,
    impactSocialMetricsByCategory,
    indirectEconomicImpactsByBearerAndCategory,
  ): ImpactsDescriptionModalsDataView | undefined =>
    contextData && impactsData
      ? {
          contextData,
          impactsData,
          projectEconomicBalance,
          environmentalMetricsByCategory: impactEnvironmentalMetricsByCategory,
          socialMetricsByCategory: impactSocialMetricsByCategory,
          economicImpactsByBearerAndCategory: indirectEconomicImpactsByBearerAndCategory,
        }
      : undefined,
);
export type ModalDataProps = ImpactsDescriptionModalsDataView;

// Page View
export type ImpactsPageViewData = {
  dataLoadingState: ProjectImpactsState["dataLoadingState"]["impacts"];
  evaluationPeriod: number | undefined;
  displayImpactsAccuracyDisclaimer: boolean;
};

export const selectImpactsPageViewData = createSelector(
  [
    selectProjectImpactsState,
    selectDisplayImpactsAccuracyDisclaimer,
    selectImpactsCroppedByEvaluationPeriod,
  ],
  (projectImpactsState, displayImpactsAccuracyDisclaimer): ImpactsPageViewData => ({
    dataLoadingState: projectImpactsState.dataLoadingState.impacts,
    evaluationPeriod: projectImpactsState.evaluationPeriod,
    displayImpactsAccuracyDisclaimer: displayImpactsAccuracyDisclaimer,
  }),
);

import { createSelector } from "@reduxjs/toolkit";
import { GetReconversionProjectImpactsResultDto, ReconversionStakeholders } from "shared";

import type { RootState } from "@/app/store/store";
import { selectAppSettings } from "@/features/app-settings/core/appSettings";
import { cropImpactsByEvaluationPeriod } from "@/features/projects/core/cropImpactsByEvaluationPeriod";
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
  SocioEconomicImpactsByBearerListView,
} from "@/features/projects/core/projectImpactsSocioEconomic";
import {
  getKeyImpactIndicatorsList,
  type KeyImpactIndicatorData,
} from "@/features/projects/core/projectKeyImpactIndicators";
import { ProjectDevelopmentPlanType } from "@/features/projects/core/projects.types";

import { type ProjectImpactsState, type ViewMode } from "../projectImpacts.reducer";

export type ModalDataProps = {
  contextData: GetReconversionProjectImpactsResultDto["contextData"];
  impactsData: GetReconversionProjectImpactsResultDto["impacts"];
};

// List View
type ImpactsListViewData = {
  economicBalance: EconomicBalanceByCategory;
  socioEconomicImpacts: SocioEconomicImpactsByBearerListView;
  environmentImpacts: EnvironmentalImpactMetricsByListViewCategory;
  socialImpacts: SocialImpactMetricsByListViewCategory;
};

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

export const selectKeyImpactIndicatorsList = createSelector(
  [selectImpactsCroppedByEvaluationPeriod, selectImpactsContextData],
  (impacts, contextData) =>
    impacts && contextData ? getKeyImpactIndicatorsList(impacts, contextData) : [],
);

export const selectImpactsListViewData = createSelector(
  [
    selectEconomicBalanceProjectImpacts,
    selectSocioEconomicProjectImpactsListView,
    selectEnvironmentalProjectImpacts,
    selectSocialProjectImpacts,
  ],
  (
    economicBalance,
    socioEconomicImpacts,
    environmentImpacts,
    socialImpacts,
  ): ImpactsListViewData => ({
    economicBalance,
    socioEconomicImpacts,
    environmentImpacts,
    socialImpacts,
  }),
);

// Summary View
type ImpactsSummaryViewData = {
  keyImpactIndicatorsList: KeyImpactIndicatorData[];
};

export const selectImpactsSummaryViewData = createSelector(
  [selectKeyImpactIndicatorsList],
  (keyImpactIndicatorsList): ImpactsSummaryViewData => ({
    keyImpactIndicatorsList,
  }),
);

const selectDisplayImpactsAccuracyDisclaimer = createSelector(
  [selectProjectImpactsState, selectAppSettings],
  (state, appSettings): boolean => {
    const isExpressProject = !!state.contextData?.isExpressProject;
    const isExpressSite = !!state.contextData?.isExpressSite;
    return (isExpressProject || isExpressSite) && appSettings.displayImpactsAccuracyDisclaimer;
  },
);

// Page View
export type ImpactsPageViewData = {
  dataLoadingState: ProjectImpactsState["dataLoadingState"];
  evaluationPeriod: number | undefined;
  currentViewMode: ViewMode;
  impactsData: ProjectImpactsState["impacts"];
  contextData: ProjectImpactsState["contextData"];
  displayImpactsAccuracyDisclaimer: boolean;
};

export const selectImpactsPageViewData = createSelector(
  [
    selectProjectImpactsState,
    selectDisplayImpactsAccuracyDisclaimer,
    selectImpactsCroppedByEvaluationPeriod,
    selectImpactsContextData,
  ],
  (
    projectImpactsState,
    displayImpactsAccuracyDisclaimer,
    impactsData,
    contextData,
  ): ImpactsPageViewData => ({
    dataLoadingState: projectImpactsState.dataLoadingState,
    evaluationPeriod: projectImpactsState.evaluationPeriod,
    currentViewMode: projectImpactsState.currentViewMode,
    displayImpactsAccuracyDisclaimer: displayImpactsAccuracyDisclaimer,
    impactsData,
    contextData,
  }),
);

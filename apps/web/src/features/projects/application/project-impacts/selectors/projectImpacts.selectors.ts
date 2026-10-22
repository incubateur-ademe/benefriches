import { createSelector } from "@reduxjs/toolkit";
import type {
  KeyImpactIndicatorData,
  ReconversionStakeholders,
  GetReconversionProjectImpactsResultDto,
} from "shared";
import { cropImpactsByEvaluationPeriod, getKeyImpactIndicatorsList } from "shared";

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

import { type ProjectImpactsState, type ViewMode } from "../projectImpacts.reducer";

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
  dataLoadingState: ProjectImpactsState["dataLoadingState"];
  evaluationPeriod: number | undefined;
  currentViewMode: ViewMode;
  impactsData: ProjectImpactsState["impacts"];
  contextData: ProjectImpactsState["contextData"];
  displayImpactsAccuracyDisclaimer: boolean;
  modalsData?: ImpactsDescriptionModalsDataView;
};

export const selectImpactsPageViewData = createSelector(
  [
    selectProjectImpactsState,
    selectDisplayImpactsAccuracyDisclaimer,
    selectImpactsCroppedByEvaluationPeriod,
    selectImpactsContextData,
    selectImpactsDescriptionModalsDataView,
  ],
  (
    projectImpactsState,
    displayImpactsAccuracyDisclaimer,
    impactsData,
    contextData,
    modalsData,
  ): ImpactsPageViewData => ({
    dataLoadingState: projectImpactsState.dataLoadingState,
    evaluationPeriod: projectImpactsState.evaluationPeriod,
    currentViewMode: projectImpactsState.currentViewMode,
    displayImpactsAccuracyDisclaimer: displayImpactsAccuracyDisclaimer,
    impactsData,
    contextData,
    modalsData,
  }),
);

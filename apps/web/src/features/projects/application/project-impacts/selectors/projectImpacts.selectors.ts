import { createSelector } from "@reduxjs/toolkit";
import { ReconversionStakeholders } from "shared";

import type { RootState } from "@/app/store/store";
import {
  getEconomicBalanceProjectImpacts,
  type EconomicBalance,
} from "@/features/projects/domain/projectImpactsEconomicBalance";
import {
  getEnvironmentalProjectImpacts,
  type EnvironmentalImpact,
} from "@/features/projects/domain/projectImpactsEnvironmental";
import {
  getSocialProjectImpacts,
  type SocialImpact,
} from "@/features/projects/domain/projectImpactsSocial";
import {
  getSocioEconomicProjectImpactsGroupedByCategory,
  SocioEconomicImpactsByBearerListView,
} from "@/features/projects/domain/projectImpactsSocioEconomic";
import {
  getKeyImpactIndicatorsList,
  type KeyImpactIndicatorData,
} from "@/features/projects/domain/projectKeyImpactIndicators";
import { ProjectDevelopmentPlanType } from "@/features/projects/domain/projects.types";
import { ModalDataProps } from "@/features/projects/views/project-page/impacts/impact-description-modals/ImpactModalDescription";

import {
  selectProjectsImpactsViewData,
  type ProjectImpactsState,
  type ViewMode,
} from "../projectImpacts.reducer";
import { selectImpactsCroppedByEvaluationPeriod } from "./projectBreakEvenLevel.selectors";

// List View
type ImpactsListViewData = {
  economicBalance: EconomicBalance;
  socioEconomicImpacts: SocioEconomicImpactsByBearerListView;
  environmentImpacts: EnvironmentalImpact[];
  socialImpacts: SocialImpact[];
  modalData: ModalDataProps;
};

const selectProjectImpactsState = (state: RootState) => state.projectImpacts;

const selectImpactsContextData = createSelector(
  selectProjectImpactsState,
  (state): ProjectImpactsState["contextData"] => state.contextData,
);

const selectStakeholders = createSelector(
  selectProjectImpactsState,
  (state): ReconversionStakeholders | undefined => state.impacts?.stakeholders,
);

export const selectSocialProjectImpacts = createSelector(
  selectImpactsCroppedByEvaluationPeriod,
  getSocialProjectImpacts,
);

export const selectEnvironmentalProjectImpacts = createSelector(
  [selectImpactsCroppedByEvaluationPeriod, selectImpactsContextData],
  (impacts, contextData) => {
    if (!impacts) {
      return [];
    }
    return getEnvironmentalProjectImpacts(impacts, contextData?.siteSurfaceArea ?? 0);
  },
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
  getEconomicBalanceProjectImpacts,
);

export const selectKeyImpactIndicatorsList = createSelector(
  [selectImpactsCroppedByEvaluationPeriod, selectImpactsContextData],
  (impacts, contextData) =>
    impacts && contextData ? getKeyImpactIndicatorsList(impacts, contextData) : [],
);

const selectModalData = createSelector(
  selectProjectImpactsState,
  (state): ModalDataProps => ({
    contextData: state.contextData!,
    impactsData: state.impacts!,
  }),
);

export const selectImpactsListViewData = createSelector(
  [
    selectEconomicBalanceProjectImpacts,
    selectSocioEconomicProjectImpactsListView,
    selectEnvironmentalProjectImpacts,
    selectSocialProjectImpacts,
    selectModalData,
  ],
  (
    economicBalance,
    socioEconomicImpacts,
    environmentImpacts,
    socialImpacts,
    modalData,
  ): ImpactsListViewData => ({
    economicBalance,
    socioEconomicImpacts,
    environmentImpacts,
    socialImpacts,
    modalData,
  }),
);

// Summary View
type ImpactsSummaryViewData = {
  keyImpactIndicatorsList: KeyImpactIndicatorData[];
  modalData: ModalDataProps;
};

export const selectImpactsSummaryViewData = createSelector(
  [selectKeyImpactIndicatorsList, selectModalData],
  (keyImpactIndicatorsList, modalData): ImpactsSummaryViewData => ({
    keyImpactIndicatorsList,
    modalData,
  }),
);

// Page View
type ImpactsPageViewData = {
  dataLoadingState: ProjectImpactsState["dataLoadingState"];
  evaluationPeriod: number | undefined;
  currentViewMode: ViewMode;
  projectName: string;
  siteName: string;
  siteId: string;
  siteNature: ReturnType<typeof selectProjectsImpactsViewData>["siteNature"];
  type: ReturnType<typeof selectProjectsImpactsViewData>["type"];
  isExpressProject: boolean;
  displayImpactsAccuracyDisclaimer: boolean;
};

export const selectImpactsPageViewData = createSelector(
  [selectProjectImpactsState, selectProjectsImpactsViewData],
  (projectImpactsState, projectsImpactsViewData): ImpactsPageViewData => ({
    dataLoadingState: projectImpactsState.dataLoadingState,
    evaluationPeriod: projectImpactsState.evaluationPeriod,
    currentViewMode: projectImpactsState.currentViewMode,
    projectName: projectsImpactsViewData.name,
    siteName: projectsImpactsViewData.siteName,
    siteId: projectsImpactsViewData.siteId,
    siteNature: projectsImpactsViewData.siteNature,
    type: projectsImpactsViewData.type,
    isExpressProject: projectsImpactsViewData.isExpressProject,
    displayImpactsAccuracyDisclaimer: projectsImpactsViewData.displayImpactsAccuracyDisclaimer,
  }),
);

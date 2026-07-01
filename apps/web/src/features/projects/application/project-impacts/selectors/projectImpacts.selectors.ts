import { createSelector } from "@reduxjs/toolkit";

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
  type SocioEconomicDetailedImpact,
} from "@/features/projects/domain/projectImpactsSocioEconomic";
import {
  getKeyImpactIndicatorsList,
  type KeyImpactIndicatorData,
} from "@/features/projects/domain/projectKeyImpactIndicators";
import { ProjectDevelopmentPlanType } from "@/features/projects/domain/projects.types";
import { ModalDataProps } from "@/features/projects/views/project-page/impacts/impact-description-modals/ImpactModalDescription";

import {
  selectModalData,
  selectProjectsImpactsViewData,
  type ProjectImpactsState,
  type ViewMode,
} from "../projectImpacts.reducer";
import { selectImpactsCroppedByEvaluationPeriod } from "./projectBreakEvenLevel.selectors";

// List View
type ImpactsListViewData = {
  economicBalance: EconomicBalance;
  socioEconomicImpacts: SocioEconomicDetailedImpact;
  environmentImpacts: EnvironmentalImpact[];
  socialImpacts: SocialImpact[];
  modalData: ModalDataProps;
};

const selectProjectImpactsState = (state: RootState) => state.projectImpacts;

const selectImpactsContextData = createSelector(
  selectProjectImpactsState,
  (state): ProjectImpactsState["contextData"] => state.contextData,
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

export const selectDetailedSocioEconomicProjectImpacts = createSelector(
  selectImpactsCroppedByEvaluationPeriod,
  getSocioEconomicProjectImpactsGroupedByCategory,
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

export const selectImpactsListViewData = createSelector(
  [
    selectEconomicBalanceProjectImpacts,
    selectDetailedSocioEconomicProjectImpacts,
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

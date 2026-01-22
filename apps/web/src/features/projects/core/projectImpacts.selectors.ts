import { createSelector } from "@reduxjs/toolkit";

import {
  selectEnvironmentalAreaChartImpactsData,
  selectSocialAreaChartImpactsData,
} from "@/features/projects/application/project-impacts/projectImpactsAreaChartsData";
import { selectEconomicBalanceProjectImpacts } from "@/features/projects/application/project-impacts/projectImpactsEconomicBalance.selectors";
import { selectEnvironmentalProjectImpacts } from "@/features/projects/application/project-impacts/projectImpactsEnvironmental.selectors";
import { selectSocialProjectImpacts } from "@/features/projects/application/project-impacts/projectImpactsSocial.selectors";
import {
  selectDetailedSocioEconomicProjectImpacts,
  selectSocioEconomicProjectImpactsByActor,
  selectTotalSocioEconomicImpact,
} from "@/features/projects/application/project-impacts/projectImpactsSocioEconomic.selectors";
import { getKeyImpactIndicatorsListSelector } from "@/features/projects/application/project-impacts/projectKeyImpactIndicators.selectors";
import type {
  EnvironmentalAreaChartImpactsData,
  SocialAreaChartImpactsData,
} from "@/features/projects/domain/projectImpactsAreaChartsData";
import type { EconomicBalance } from "@/features/projects/domain/projectImpactsEconomicBalance";
import type { EnvironmentalImpact } from "@/features/projects/domain/projectImpactsEnvironmental";
import type { SocialImpact } from "@/features/projects/domain/projectImpactsSocial";
import type {
  SocioEconomicDetailedImpact,
  SocioEconomicImpactByActor,
} from "@/features/projects/domain/projectImpactsSocioEconomic";
import type { KeyImpactIndicatorData } from "@/features/projects/domain/projectKeyImpactIndicators";
import type { RootState } from "@/shared/core/store-config/store";

import {
  selectModalData,
  selectProjectName,
  selectProjectsImpactsViewData,
  type ProjectImpactsState,
  type ViewMode,
} from "../application/project-impacts/projectImpacts.reducer";
import type { ModalDataProps } from "../views/project-page/impacts/impact-description-modals/ImpactModalDescription";

// Charts View
export type ImpactsChartsViewData = {
  projectName: string;
  economicBalance: EconomicBalance;
  socioEconomicTotalImpact: number;
  socioEconomicImpactsByActor: SocioEconomicImpactByActor;
  socialAreaChartImpactsData: SocialAreaChartImpactsData;
  environmentalAreaChartImpactsData: EnvironmentalAreaChartImpactsData;
  modalData: ModalDataProps;
};

export const selectImpactsChartsViewData = createSelector(
  [
    selectProjectName,
    selectEconomicBalanceProjectImpacts,
    selectTotalSocioEconomicImpact,
    selectSocioEconomicProjectImpactsByActor,
    selectSocialAreaChartImpactsData,
    selectEnvironmentalAreaChartImpactsData,
    selectModalData,
  ],
  (
    projectName,
    economicBalance,
    socioEconomicTotalImpact,
    socioEconomicImpactsByActor,
    socialAreaChartImpactsData,
    environmentalAreaChartImpactsData,
    modalData,
  ): ImpactsChartsViewData => ({
    projectName,
    economicBalance,
    socioEconomicTotalImpact,
    socioEconomicImpactsByActor,
    socialAreaChartImpactsData,
    environmentalAreaChartImpactsData,
    modalData,
  }),
);

// List View
export type ImpactsListViewData = {
  economicBalance: EconomicBalance;
  socioEconomicImpacts: SocioEconomicDetailedImpact;
  environmentImpacts: EnvironmentalImpact[];
  socialImpacts: SocialImpact[];
  modalData: ModalDataProps;
};

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
export type ImpactsSummaryViewData = {
  keyImpactIndicatorsList: KeyImpactIndicatorData[];
  modalData: ModalDataProps;
};

export const selectImpactsSummaryViewData = createSelector(
  [getKeyImpactIndicatorsListSelector, selectModalData],
  (keyImpactIndicatorsList, modalData): ImpactsSummaryViewData => ({
    keyImpactIndicatorsList,
    modalData,
  }),
);

// Page View
export type ImpactsPageViewData = {
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

const selectProjectImpactsState = (state: RootState) => state.projectImpacts;

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

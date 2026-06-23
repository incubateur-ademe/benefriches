import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store/store";
import { selectEconomicBalanceProjectImpacts } from "@/features/projects/application/project-impacts/selectors/projectImpactsEconomicBalance.selectors";
import { selectEnvironmentalProjectImpacts } from "@/features/projects/application/project-impacts/selectors/projectImpactsEnvironmental.selectors";
import { selectSocialProjectImpacts } from "@/features/projects/application/project-impacts/selectors/projectImpactsSocial.selectors";
import { selectDetailedSocioEconomicProjectImpacts } from "@/features/projects/application/project-impacts/selectors/projectImpactsSocioEconomic.selectors";
import { getKeyImpactIndicatorsListSelector } from "@/features/projects/application/project-impacts/selectors/projectKeyImpactIndicators.selectors";
import type { EconomicBalance } from "@/features/projects/domain/projectImpactsEconomicBalance";
import type { EnvironmentalImpact } from "@/features/projects/domain/projectImpactsEnvironmental";
import type { SocialImpact } from "@/features/projects/domain/projectImpactsSocial";
import type { SocioEconomicDetailedImpact } from "@/features/projects/domain/projectImpactsSocioEconomic";
import type { KeyImpactIndicatorData } from "@/features/projects/domain/projectKeyImpactIndicators";
import { ModalDataProps } from "@/features/projects/views/project-page/impacts/impact-description-modals/ImpactModalDescription";

import {
  selectModalData,
  selectProjectsImpactsViewData,
  type ProjectImpactsState,
  type ViewMode,
} from "../projectImpacts.reducer";

// List View
type ImpactsListViewData = {
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
type ImpactsSummaryViewData = {
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

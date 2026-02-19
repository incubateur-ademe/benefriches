import { createSelector } from "@reduxjs/toolkit";
import type { SiteNature } from "shared";

import { getSummaryIndicatorsComparison } from "@/features/projects/application/project-impacts-urban-sprawl-comparison/summary.selectors";
import type {
  UrbanSprawlImpactsComparisonState,
  ViewMode,
} from "@/features/projects/application/project-impacts-urban-sprawl-comparison/urbanSprawlComparison.reducer";
import { selectDisplayOnboarding } from "@/features/projects/application/project-impacts-urban-sprawl-comparison/urbanSprawlComparisonOnboardingSkip.selector";
import type { KeyImpactIndicatorData } from "@/features/projects/domain/projectKeyImpactIndicators";
import type { RootState } from "@/shared/core/store-config/store";

// Page View
export type UrbanSprawlComparisonViewData = {
  comparisonSiteNature: SiteNature | undefined;
  evaluationPeriod: number;
  dataLoadingState: UrbanSprawlImpactsComparisonState["dataLoadingState"];
  projectData: UrbanSprawlImpactsComparisonState["projectData"];
  baseCase: UrbanSprawlImpactsComparisonState["baseCase"];
  comparisonCase: UrbanSprawlImpactsComparisonState["comparisonCase"];
  currentViewMode: ViewMode;
  projectImpactsEvaluationPeriod: number | undefined;
  projectImpactsLoadingState: RootState["projectImpacts"]["dataLoadingState"];
  projectName: string | undefined;
  relatedSiteNature: SiteNature | undefined;
  shouldDisplayOnBoarding: boolean;
};

const selectUrbanSprawlComparisonState = (state: RootState) => state.urbanSprawlComparison;
const selectProjectImpactsState = (state: RootState) => state.projectImpacts;

export const selectUrbanSprawlComparisonViewData = createSelector(
  [selectUrbanSprawlComparisonState, selectProjectImpactsState, selectDisplayOnboarding],
  (
    urbanSprawlComparison,
    projectImpacts,
    shouldDisplayOnBoarding,
  ): UrbanSprawlComparisonViewData => ({
    comparisonSiteNature: urbanSprawlComparison.comparisonSiteNature,
    evaluationPeriod: urbanSprawlComparison.evaluationPeriod,
    dataLoadingState: urbanSprawlComparison.dataLoadingState,
    projectData: urbanSprawlComparison.projectData,
    baseCase: urbanSprawlComparison.baseCase,
    comparisonCase: urbanSprawlComparison.comparisonCase,
    currentViewMode: urbanSprawlComparison.currentViewMode,
    projectImpactsEvaluationPeriod: projectImpacts.evaluationPeriod,
    projectImpactsLoadingState: projectImpacts.dataLoadingState,
    projectName: projectImpacts.projectData?.name,
    relatedSiteNature: projectImpacts.relatedSiteData?.nature,
    shouldDisplayOnBoarding,
  }),
);

// Summary View
export type UrbanSprawlSummaryViewData = {
  baseCase: {
    indicators: KeyImpactIndicatorData[];
    siteNature: SiteNature;
  };
  comparisonCase: {
    indicators: KeyImpactIndicatorData[];
    siteNature: SiteNature;
  };
  modalData: Pick<
    Required<UrbanSprawlImpactsComparisonState>,
    "baseCase" | "comparisonCase" | "projectData"
  >;
};

export const selectUrbanSprawlSummaryViewData = createSelector(
  [getSummaryIndicatorsComparison, selectUrbanSprawlComparisonState],
  (keyImpactIndicators, comparisonState): UrbanSprawlSummaryViewData => ({
    ...keyImpactIndicators,
    modalData: {
      baseCase: comparisonState.baseCase!,
      comparisonCase: comparisonState.comparisonCase!,
      projectData: comparisonState.projectData!,
    },
  }),
);

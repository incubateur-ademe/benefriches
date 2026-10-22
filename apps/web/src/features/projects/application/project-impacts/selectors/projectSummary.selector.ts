import { createSelector } from "@reduxjs/toolkit";
import type { KeyImpactIndicatorData, ProjectDevelopmentScore } from "shared";
import { getSummaryHeadlineIndicators } from "shared";

import type { RootState } from "@/app/store/store";

import {
  selectImpactsCroppedByEvaluationPeriod,
  selectKeyImpactIndicatorsList,
} from "./projectImpacts.selectors";

export type ProjectSummaryDataView = {
  mainImpactIndicator?: KeyImpactIndicatorData;
  developmentScore: ProjectDevelopmentScore;
  breakEvenYear?: string;
  projectionYears: string[];
  siteAddress: {
    lat?: number;
    long?: number;
    label: string;
  };
  siteId: string;
  siteName: string;
  projectContext: {
    isUrban: boolean;
    isDemo: boolean;
  };
};

const selectSelf = (state: RootState) => state.projectImpacts;

export const selectProjectSummaryDataView = createSelector(
  [selectSelf, selectKeyImpactIndicatorsList, selectImpactsCroppedByEvaluationPeriod],
  (state, keyImpactIndicatorList, breakEvenLevel): ProjectSummaryDataView | undefined => {
    if (!breakEvenLevel || !state.contextData || !state.developmentScore) {
      return undefined;
    }
    const { mainImpactIndicator } = getSummaryHeadlineIndicators(keyImpactIndicatorList);

    return {
      breakEvenYear: breakEvenLevel.aggregatedReconversionImpacts.breakEvenYear,
      projectionYears: breakEvenLevel.projectionYears,
      developmentScore: state.developmentScore,
      mainImpactIndicator,
      siteId: state.contextData.relatedSiteId,
      siteName: state.contextData.relatedSiteName,
      siteAddress: state.contextData.siteAddress,
      projectContext: {
        isDemo: state.contextData?.isExpressProject ?? false,
        isUrban: state.contextData?.projectDevelopmentPlan.type === "URBAN_PROJECT",
      },
    };
  },
);

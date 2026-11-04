import { createSelector } from "@reduxjs/toolkit";
import {
  type AvoidedCostsAnalysisData,
  getAvoidedCostsAnalysisData,
  type ProjectDevelopmentScore,
} from "shared";

import type { RootState } from "@/app/store/store";

import { selectImpactsCroppedByEvaluationPeriod } from "./projectImpacts.selectors";

export type ProjectSummaryDataView = {
  developmentScore: ProjectDevelopmentScore;
  avoidedCostsAnalysisData: AvoidedCostsAnalysisData;
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
  [selectSelf, selectImpactsCroppedByEvaluationPeriod],
  (state, breakEvenLevel): ProjectSummaryDataView | undefined => {
    if (!breakEvenLevel || !state.contextData || !state.developmentScore) {
      return undefined;
    }

    return {
      breakEvenYear: breakEvenLevel.aggregatedReconversionImpacts.breakEvenYear,
      projectionYears: breakEvenLevel.projectionYears,
      developmentScore: state.developmentScore,
      avoidedCostsAnalysisData: getAvoidedCostsAnalysisData(breakEvenLevel),
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

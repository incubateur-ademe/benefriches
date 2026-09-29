import { createSelector } from "@reduxjs/toolkit";
import type { KeyImpactIndicatorData, ZanComplianceIndicator } from "shared";
import { getSummaryHeadlineIndicators } from "shared";

import type { RootState } from "@/app/store/store";

import type { ProjectImpactsState } from "../projectImpacts.reducer";
import {
  selectImpactsCroppedByEvaluationPeriod,
  selectKeyImpactIndicatorsList,
} from "./projectImpacts.selectors";

export type ProjectSummaryDataView = {
  mainImpactIndicator?: KeyImpactIndicatorData;
  zanCompliance?: ZanComplianceIndicator;
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

const selectContextData = createSelector(
  selectSelf,
  (state): ProjectImpactsState["contextData"] => state.contextData,
);

export const selectProjectSummaryDataView = createSelector(
  [selectContextData, selectKeyImpactIndicatorsList, selectImpactsCroppedByEvaluationPeriod],
  (contextData, keyImpactIndicatorList, breakEvenLevel): ProjectSummaryDataView | undefined => {
    if (!breakEvenLevel || !contextData) {
      return undefined;
    }
    const { zanCompliance, mainImpactIndicator } =
      getSummaryHeadlineIndicators(keyImpactIndicatorList);

    return {
      breakEvenYear: breakEvenLevel.aggregatedReconversionImpacts.breakEvenYear,
      projectionYears: breakEvenLevel.projectionYears,
      zanCompliance,
      mainImpactIndicator,
      siteId: contextData.relatedSiteId,
      siteName: contextData.relatedSiteName,
      siteAddress: contextData.siteAddress,
      projectContext: {
        isDemo: contextData?.isExpressProject ?? false,
        isUrban: contextData?.projectDevelopmentPlan.type === "URBAN_PROJECT",
      },
    };
  },
);

import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "@/app/store/store";

import { KeyImpactIndicatorData, PRIORITY_ORDER } from "../../../core/projectKeyImpactIndicators";
import { ProjectImpactsState } from "../projectImpacts.reducer";
import { selectImpactsCroppedByEvaluationPeriod } from "./projectBreakEvenLevel.selectors";
import { selectKeyImpactIndicatorsList } from "./projectImpacts.selectors";

type ZanCompliance = Extract<KeyImpactIndicatorData, { name: "zanCompliance" }>;
export type ProjectSummaryDataView = {
  mainImpactIndicator?: KeyImpactIndicatorData;
  zanCompliance?: ZanCompliance;
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
    const zanCompliance = keyImpactIndicatorList.find(
      (indicator): indicator is ZanCompliance => indicator.name === "zanCompliance",
    );

    const mainImpactIndicator = keyImpactIndicatorList
      .toSorted(
        ({ name: aName }, { name: bName }) =>
          PRIORITY_ORDER.indexOf(aName) - PRIORITY_ORDER.indexOf(bName),
      )
      .find(({ name }) => name !== "zanCompliance" && name !== "projectImpactBalance");

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

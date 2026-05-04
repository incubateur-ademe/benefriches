import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "@/app/store/store";

import { KeyImpactIndicatorData } from "../../domain/projectKeyImpactIndicators";
import { PRIORITY_ORDER } from "../../views/shared/impacts/summary";
import { selectBreakEvenLevelByEvaluationPeriod } from "./projectBreakEvenLevel.selectors";
import { ProjectImpactsState } from "./projectImpacts.reducer";
import { getKeyImpactIndicatorsListSelector } from "./projectKeyImpactIndicators.selectors";

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

const selectSiteData = createSelector(
  selectSelf,
  (state): ProjectImpactsState["relatedSiteData"] => state.relatedSiteData,
);

const selectProjectData = createSelector(
  selectSelf,
  (state): ProjectImpactsState["projectData"] => state.projectData,
);

export const selectProjectSummaryDataView = createSelector(
  [
    selectProjectData,
    selectSiteData,
    getKeyImpactIndicatorsListSelector,
    selectBreakEvenLevelByEvaluationPeriod,
  ],
  (
    projectData,
    siteData,
    keyImpactIndicatorList,
    breakEvenLevel,
  ): ProjectSummaryDataView | undefined => {
    if (!breakEvenLevel || !siteData) {
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
      breakEvenYear: breakEvenLevel.breakEvenYear,
      projectionYears: breakEvenLevel.projectionYears,
      zanCompliance,
      mainImpactIndicator,
      siteId: siteData.id,
      siteName: siteData.name,
      siteAddress: {
        label: siteData.addressLabel,
        lat: siteData.addressLat,
        long: siteData.addressLong,
      },
      projectContext: {
        isDemo: projectData?.isExpressProject ?? false,
        isUrban: projectData?.developmentPlan.type === "URBAN_PROJECT",
      },
    };
  },
);

import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "@/shared/core/store-config/store";

import { getUrbanSprawlComparisonImpactIndicatorsList } from "../../domain/projectKeyImpactIndicators";

const selectSelf = (state: RootState) => state.urbanSprawlComparison;

export const getSummaryIndicatorsComparison = createSelector(selectSelf, (state) =>
  state.baseCase && state.comparisonCase
    ? {
        baseCase: {
          siteName: state.baseCase.conversionSiteData.name,
          indicators: getUrbanSprawlComparisonImpactIndicatorsList(state.baseCase),
        },
        comparisonCase: {
          siteName: state.comparisonCase.conversionSiteData.name,
          indicators: getUrbanSprawlComparisonImpactIndicatorsList(state.comparisonCase),
        },
      }
    : {
        baseCase: {
          siteName: "",
          indicators: [],
        },
        comparisonCase: {
          siteName: "",
          indicators: [],
        },
      },
);

import { createSelector } from "@reduxjs/toolkit";
import { SiteNature } from "shared";

import { RootState } from "@/shared/core/store-config/store";

import { getUrbanSprawlComparisonImpactIndicatorsList } from "../../domain/projectKeyImpactIndicators";

const selectSelf = (state: RootState) => state.urbanSprawlComparison;

export const getSummaryIndicatorsComparison = createSelector(selectSelf, (state) =>
  state.baseCase && state.comparisonCase
    ? {
        baseCase: {
          siteNature: state.baseCase.conversionSiteData.nature,
          indicators: getUrbanSprawlComparisonImpactIndicatorsList(state.baseCase),
        },
        comparisonCase: {
          siteNature: state.comparisonCase.conversionSiteData.nature,
          indicators: getUrbanSprawlComparisonImpactIndicatorsList(state.comparisonCase),
        },
      }
    : {
        baseCase: {
          siteNature: "FRICHE" as SiteNature,
          indicators: [],
        },
        comparisonCase: {
          siteNature: "AGRICULTURAL_OPERATION" as SiteNature,
          indicators: [],
        },
      },
);

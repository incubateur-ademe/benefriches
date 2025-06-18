import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "@/shared/core/store-config/store";

import { getKeyImpactIndicatorsList } from "../../domain/projectKeyImpactIndicators";

const selectSelf = (state: RootState) => state.urbanSprawlComparison;

export const getSummaryIndicatorsComparison = createSelector(selectSelf, (state) =>
  state.baseCase && state.comparisonCase
    ? {
        baseCase: {
          siteName: state.baseCase.siteData.name,
          indicators: getKeyImpactIndicatorsList(state.baseCase.impacts, state.baseCase.siteData),
        },
        comparisonCase: {
          siteName: state.comparisonCase.siteData.name,
          indicators: getKeyImpactIndicatorsList(
            state.comparisonCase.impacts,
            state.comparisonCase.siteData,
          ),
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

import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "@/shared/core/store-config/store";

import { getKeyImpactIndicatorsList } from "../../domain/projectKeyImpactIndicators";

const selectSelf = (state: RootState) => state.projectImpacts;

export const getKeyImpactIndicatorsListSelector = createSelector(selectSelf, (state) =>
  state.impactsData && state.relatedSiteData
    ? getKeyImpactIndicatorsList(state.impactsData, state.relatedSiteData)
    : [],
);

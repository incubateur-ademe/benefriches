import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "@/shared/core/store-config/store";

import {
  getEnvironmentalAreaChartImpactsData,
  getSocialAreaChartImpactsData,
} from "../../domain/projectImpactsAreaChartsData";

export const selectSocialAreaChartImpactsData = createSelector(
  (state: RootState) => state.projectImpacts.impactsData,
  getSocialAreaChartImpactsData,
);

export const selectEnvironmentalAreaChartImpactsData = createSelector(
  (state: RootState) => state.projectImpacts,
  (state) =>
    getEnvironmentalAreaChartImpactsData({
      projectContaminatedSurfaceArea: state.projectData?.contaminatedSoilSurface,
      siteContaminatedSurfaceArea: state.relatedSiteData?.contaminatedSoilSurface,
      impactsData: state.impactsData,
    }),
);

import { createSelector } from "@reduxjs/toolkit";
import type { SoilsDistribution } from "shared";

import type { RootState } from "@/app/store/store";

import { aggregateSoilsDistribution } from "../soilsReaders";

export type UrbanZoneSoilsSummaryViewData = {
  soilsDistribution: SoilsDistribution;
  totalSurfaceArea: number;
};

export const selectUrbanZoneSoilsSummaryViewData = createSelector(
  [
    (state: RootState) => state.siteCreation.urbanZone.steps,
    (state: RootState) => state.siteCreation.siteData.surfaceArea,
  ],
  (steps, totalSurfaceArea): UrbanZoneSoilsSummaryViewData => {
    return {
      soilsDistribution: aggregateSoilsDistribution(steps),
      totalSurfaceArea: totalSurfaceArea ?? 0,
    };
  },
);

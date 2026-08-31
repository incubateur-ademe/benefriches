import { createSelector } from "@reduxjs/toolkit";
import type { SoilsDistribution } from "shared";

import type { RootState } from "@/app/store/store";

import { selectSiteSurfaceArea } from "../../../../selectors/createSite.selectors";
import { aggregateSoilsDistribution } from "../soilsReaders";

type UrbanZoneSoilsSummaryViewData = {
  soilsDistribution: SoilsDistribution;
  totalSurfaceArea: number;
};

export const selectUrbanZoneSoilsSummaryViewData = createSelector(
  [(state: RootState) => state.siteCreation.urbanZone.steps, selectSiteSurfaceArea],
  (steps, totalSurfaceArea): UrbanZoneSoilsSummaryViewData => {
    return {
      soilsDistribution: aggregateSoilsDistribution(steps),
      totalSurfaceArea: totalSurfaceArea ?? 0,
    };
  },
);

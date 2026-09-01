import { createSelector } from "@reduxjs/toolkit";
import type { SoilsDistribution } from "shared";

import type { createSiteFormRootSelectors } from "../../../../selectors/createSite.selectors";
import { siteCreationRootSelectors } from "../../../../selectors/createSite.selectors";
import { aggregateSoilsDistribution } from "../soilsReaders";

type UrbanZoneSoilsSummaryViewData = {
  soilsDistribution: SoilsDistribution;
  totalSurfaceArea: number;
};

export const createUrbanZoneSoilsSummarySelectors = (
  rootSelectors: ReturnType<typeof createSiteFormRootSelectors>,
) => {
  const selectUrbanZoneSoilsSummaryViewData = createSelector(
    [rootSelectors.selectUrbanZoneSteps, rootSelectors.selectSiteSurfaceArea],
    (steps, totalSurfaceArea): UrbanZoneSoilsSummaryViewData => {
      return {
        soilsDistribution: aggregateSoilsDistribution(steps),
        totalSurfaceArea: totalSurfaceArea ?? 0,
      };
    },
  );

  return { selectUrbanZoneSoilsSummaryViewData };
};

export const { selectUrbanZoneSoilsSummaryViewData } =
  createUrbanZoneSoilsSummarySelectors(siteCreationRootSelectors);

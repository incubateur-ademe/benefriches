import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";
import type { SoilsDistribution } from "shared";

import type { RootState } from "@/shared/core/store-config/store";

type SoilsSummaryViewData = {
  siteSoilsDistribution: SoilsDistribution;
  projectSoilsDistribution: SoilsDistribution;
};

export const createSelectSoilsSummaryViewData = (
  selectSiteSoilsDistribution: Selector<RootState, SoilsDistribution>,
  selectProjectSoilsDistributionByType: Selector<RootState, SoilsDistribution>,
) =>
  createSelector(
    [selectSiteSoilsDistribution, selectProjectSoilsDistributionByType],
    (siteSoilsDistribution, projectSoilsDistribution): SoilsSummaryViewData => ({
      siteSoilsDistribution,
      projectSoilsDistribution,
    }),
  );

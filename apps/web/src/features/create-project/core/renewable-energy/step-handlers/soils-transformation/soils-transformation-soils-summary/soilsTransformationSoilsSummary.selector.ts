import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";
import type { SoilsDistribution } from "shared";

import type { RootState } from "@/app/store/store";

type PVSoilsSummaryViewData = {
  siteSoilsDistribution: SoilsDistribution;
  projectSoilsDistribution: SoilsDistribution;
};

export const createSelectPVSoilsSummaryViewData = (
  selectSiteSoilsDistribution: Selector<RootState, SoilsDistribution>,
  selectProjectSoilsDistribution: Selector<RootState, SoilsDistribution>,
) =>
  createSelector(
    [selectSiteSoilsDistribution, selectProjectSoilsDistribution],
    (siteSoilsDistribution, projectSoilsDistribution): PVSoilsSummaryViewData => ({
      siteSoilsDistribution,
      projectSoilsDistribution,
    }),
  );

import { createSelector } from "@reduxjs/toolkit";
import type { SoilsDistribution } from "shared";

import { selectSiteSoilsDistribution } from "../../../../createProject.selectors";
import { selectProjectSoilsDistribution } from "../../../selectors/renewableEnergy.selector";

type PVSoilsSummaryViewData = {
  siteSoilsDistribution: SoilsDistribution;
  projectSoilsDistribution: SoilsDistribution;
};

export const selectPVSoilsSummaryViewData = createSelector(
  [selectSiteSoilsDistribution, selectProjectSoilsDistribution],
  (siteSoilsDistribution, projectSoilsDistribution): PVSoilsSummaryViewData => ({
    siteSoilsDistribution,
    projectSoilsDistribution,
  }),
);

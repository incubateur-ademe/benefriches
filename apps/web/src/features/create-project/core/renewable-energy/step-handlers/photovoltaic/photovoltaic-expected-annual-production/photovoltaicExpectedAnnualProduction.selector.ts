import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "@/app/store/store";

const selectExpectedPhotovoltaicPerformance = (state: RootState) =>
  state.projectCreation.renewableEnergyProject.expectedPhotovoltaicPerformance;

type ExpectedAnnualProductionViewData = {
  loadingState: string;
  expectedPerformanceMwhPerYear: number | undefined;
};

export const selectExpectedAnnualProductionViewData = createSelector(
  selectExpectedPhotovoltaicPerformance,
  (performance): ExpectedAnnualProductionViewData => ({
    loadingState: performance.loadingState,
    expectedPerformanceMwhPerYear: performance.expectedPerformanceMwhPerYear,
  }),
);

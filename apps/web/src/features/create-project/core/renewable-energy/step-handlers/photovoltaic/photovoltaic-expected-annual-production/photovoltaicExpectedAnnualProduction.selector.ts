import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store/store";

type ExpectedPhotovoltaicPerformance = {
  loadingState: "idle" | "loading" | "success" | "error";
  expectedPerformanceMwhPerYear?: number;
};

type ExpectedAnnualProductionViewData = {
  loadingState: string;
  expectedPerformanceMwhPerYear: number | undefined;
};

export const createSelectExpectedAnnualProductionViewData = (
  selectExpectedPhotovoltaicPerformance: Selector<RootState, ExpectedPhotovoltaicPerformance>,
) =>
  createSelector(
    selectExpectedPhotovoltaicPerformance,
    (performance): ExpectedAnnualProductionViewData => ({
      loadingState: performance.loadingState,
      expectedPerformanceMwhPerYear: performance.expectedPerformanceMwhPerYear,
    }),
  );

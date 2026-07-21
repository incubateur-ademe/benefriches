import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store/store";
import type { UrbanProjectStepsState } from "@/features/create-project/core/urban-project/urbanProject.state";

import { getBuildingsFootprintToConstruct } from "../buildingsReaders";

type BuildingsNewConstructionInfoViewData = {
  buildingsFootprintToConstruct: number;
};

export const createSelectBuildingsNewConstructionInfoViewData = (
  selectStepState: Selector<RootState, UrbanProjectStepsState>,
) =>
  createSelector(
    [selectStepState],
    (stepsState): BuildingsNewConstructionInfoViewData => ({
      buildingsFootprintToConstruct: getBuildingsFootprintToConstruct(stepsState),
    }),
  );

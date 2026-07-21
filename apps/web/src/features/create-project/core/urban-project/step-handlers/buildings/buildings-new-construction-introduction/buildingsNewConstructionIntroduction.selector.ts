import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store/store";
import type { UrbanProjectStepsState } from "@/features/create-project/core/urban-project/urbanProject.state";

import { getProjectBuildingsFootprint } from "../buildingsReaders";

type BuildingsNewConstructionIntroductionViewData = {
  buildingsFootprintToConstruct: number;
};

export const createSelectBuildingsNewConstructionIntroductionViewData = (
  selectStepState: Selector<RootState, UrbanProjectStepsState>,
) =>
  createSelector(
    [selectStepState],
    (stepsState): BuildingsNewConstructionIntroductionViewData => ({
      buildingsFootprintToConstruct: getProjectBuildingsFootprint(stepsState),
    }),
  );

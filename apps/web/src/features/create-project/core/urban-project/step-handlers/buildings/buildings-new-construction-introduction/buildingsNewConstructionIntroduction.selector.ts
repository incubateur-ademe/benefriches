import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store/store";
import { getProjectBuildingsFootprint } from "@/features/create-project/core/urban-project/helpers/readers/buildingsReaders";
import type { UrbanProjectStepsState } from "@/features/create-project/core/urban-project/urbanProject.state";

type BuildingsNewConstructionIntroductionViewData = {
  buildingsFootprintToConstruct: number;
};

export const createSelectBuildingsNewConstructionIntroductionViewData = (
  selectStepState: Selector<RootState, UrbanProjectStepsState>,
) =>
  createSelector([selectStepState], (stepsState): BuildingsNewConstructionIntroductionViewData => ({
    buildingsFootprintToConstruct: getProjectBuildingsFootprint(stepsState),
  }));

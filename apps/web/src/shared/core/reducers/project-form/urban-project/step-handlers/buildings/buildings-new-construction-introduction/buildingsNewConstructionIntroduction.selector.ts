import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store/store";
import type { ProjectFormState } from "@/shared/core/reducers/project-form/projectForm.reducer";

import { getProjectBuildingsFootprint } from "../buildingsReaders";

type BuildingsNewConstructionIntroductionViewData = {
  buildingsFootprintToConstruct: number;
};

export const createSelectBuildingsNewConstructionIntroductionViewData = (
  selectStepState: Selector<RootState, ProjectFormState["urbanProject"]["steps"]>,
) =>
  createSelector(
    [selectStepState],
    (stepsState): BuildingsNewConstructionIntroductionViewData => ({
      buildingsFootprintToConstruct: getProjectBuildingsFootprint(stepsState),
    }),
  );

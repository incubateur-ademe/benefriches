import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store/store";
import type { ProjectFormState } from "@/shared/core/reducers/project-form/projectForm.reducer";

import { getBuildingsFootprintToConstruct } from "../buildingsReaders";

type BuildingsNewConstructionInfoViewData = {
  buildingsFootprintToConstruct: number;
};

export const createSelectBuildingsNewConstructionInfoViewData = (
  selectStepState: Selector<RootState, ProjectFormState["urbanProject"]["steps"]>,
) =>
  createSelector(
    [selectStepState],
    (stepsState): BuildingsNewConstructionInfoViewData => ({
      buildingsFootprintToConstruct: getBuildingsFootprintToConstruct(stepsState),
    }),
  );

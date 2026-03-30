import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store/store";
import type { ProjectFormState } from "@/shared/core/reducers/project-form/projectForm.reducer";
import type { ProjectSiteView } from "@/shared/core/reducers/project-form/projectForm.types";

import { getBuildingsFootprintToDemolish } from "../buildingsReaders";

type BuildingsDemolitionInfoViewData = {
  buildingsFootprintToDemolish: number;
};

export const createSelectBuildingsDemolitionInfoViewData = (
  selectStepState: Selector<RootState, ProjectFormState["urbanProject"]["steps"]>,
  selectSiteData: Selector<RootState, ProjectSiteView | undefined>,
) =>
  createSelector(
    [selectStepState, selectSiteData],
    (stepsState, siteData): BuildingsDemolitionInfoViewData => ({
      buildingsFootprintToDemolish: siteData
        ? getBuildingsFootprintToDemolish(siteData, stepsState)
        : 0,
    }),
  );

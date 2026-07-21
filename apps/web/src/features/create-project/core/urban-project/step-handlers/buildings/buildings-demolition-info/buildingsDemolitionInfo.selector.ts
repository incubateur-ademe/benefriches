import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store/store";
import type { ProjectSiteView } from "@/features/create-project/core/project-form/projectSite.types";
import type { UrbanProjectStepsState } from "@/features/create-project/core/urban-project/urbanProject.state";

import { getBuildingsFootprintToDemolish } from "../buildingsReaders";

type BuildingsDemolitionInfoViewData = {
  buildingsFootprintToDemolish: number;
};

export const createSelectBuildingsDemolitionInfoViewData = (
  selectStepState: Selector<RootState, UrbanProjectStepsState>,
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

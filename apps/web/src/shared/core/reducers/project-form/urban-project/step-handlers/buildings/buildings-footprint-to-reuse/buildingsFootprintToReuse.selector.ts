import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";
import type { SoilsDistribution } from "shared";

import type { RootState } from "@/app/store/store";
import type { ProjectFormState } from "@/shared/core/reducers/project-form/projectForm.reducer";
import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";

type BuildingsFootprintToReuseViewData = {
  siteBuildingsFootprint: number;
  currentValue: number | undefined;
};

export const createSelectBuildingsFootprintToReuseViewData = (
  selectStepState: Selector<RootState, ProjectFormState["urbanProject"]["steps"]>,
  selectSiteSoilsDistribution: Selector<RootState, SoilsDistribution>,
) =>
  createSelector(
    [selectStepState, selectSiteSoilsDistribution],
    (steps, soilsDistribution): BuildingsFootprintToReuseViewData => ({
      siteBuildingsFootprint: soilsDistribution.BUILDINGS ?? 0,
      currentValue: ReadStateHelper.getStepAnswers(
        steps,
        "URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE",
      )?.buildingsFootprintToReuse,
    }),
  );

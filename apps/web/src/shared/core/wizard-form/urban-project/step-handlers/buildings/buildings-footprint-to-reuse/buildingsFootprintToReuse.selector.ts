import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";
import type { SoilsDistribution } from "shared";

import type { RootState } from "@/app/store/store";
import { ReadStateHelper } from "@/shared/core/wizard-form/urban-project/helpers/readState";
import type { WizardFormState } from "@/shared/core/wizard-form/wizardForm.reducer";

type BuildingsFootprintToReuseViewData = {
  siteBuildingsFootprint: number;
  maxBuildingsFootprintToReuse: number;
  currentValue: number | undefined;
};

export const createSelectBuildingsFootprintToReuseViewData = (
  selectStepState: Selector<RootState, WizardFormState["urbanProject"]["steps"]>,
  selectSiteSoilsDistribution: Selector<RootState, SoilsDistribution>,
) =>
  createSelector(
    [selectStepState, selectSiteSoilsDistribution],
    (steps, soilsDistribution): BuildingsFootprintToReuseViewData => {
      const siteBuildingsFootprint = soilsDistribution.BUILDINGS ?? 0;
      const projectBuildingsFootprint = ReadStateHelper.getStepAnswers(
        steps,
        "URBAN_PROJECT_SPACES_SURFACE_AREA",
      )?.spacesSurfaceAreaDistribution?.BUILDINGS;

      return {
        siteBuildingsFootprint,
        maxBuildingsFootprintToReuse:
          projectBuildingsFootprint === undefined
            ? siteBuildingsFootprint
            : Math.min(siteBuildingsFootprint, projectBuildingsFootprint),
        currentValue: ReadStateHelper.getStepAnswers(
          steps,
          "URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE",
        )?.buildingsFootprintToReuse,
      };
    },
  );

import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store/store";
import type { UrbanProjectStepsState } from "@/features/create-project/core/urban-project/urbanProject.state";
import { ReadStateHelper } from "@/shared/core/wizard-form/helpers/readState";

type SoilsDecontaminationSurfaceAreaViewData = {
  decontaminatedSurfaceArea: number | undefined;
  siteContaminatedSurfaceArea: number;
};

export const createSelectSoilsDecontaminationSurfaceAreaViewData = (
  selectStepState: Selector<RootState, UrbanProjectStepsState>,
  selectSiteContaminatedSurfaceArea: Selector<RootState, number>,
) =>
  createSelector(
    [selectStepState, selectSiteContaminatedSurfaceArea],
    (steps, siteContaminatedSurfaceArea): SoilsDecontaminationSurfaceAreaViewData => ({
      decontaminatedSurfaceArea: ReadStateHelper.getStepAnswers(
        steps,
        "URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA",
      )?.decontaminatedSurfaceArea,
      siteContaminatedSurfaceArea,
    }),
  );

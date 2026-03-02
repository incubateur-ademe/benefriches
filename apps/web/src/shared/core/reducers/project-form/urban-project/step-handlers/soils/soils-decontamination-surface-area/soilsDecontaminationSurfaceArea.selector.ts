import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store/store";
import type { ProjectFormState } from "@/shared/core/reducers/project-form/projectForm.reducer";
import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";

type SoilsDecontaminationSurfaceAreaViewData = {
  decontaminatedSurfaceArea: number | undefined;
  siteContaminatedSurfaceArea: number;
};

export const createSelectSoilsDecontaminationSurfaceAreaViewData = (
  selectStepState: Selector<RootState, ProjectFormState["urbanProject"]["steps"]>,
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

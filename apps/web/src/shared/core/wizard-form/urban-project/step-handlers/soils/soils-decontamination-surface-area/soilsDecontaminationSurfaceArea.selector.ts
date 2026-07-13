import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store/store";
import { ReadStateHelper } from "@/shared/core/wizard-form/urban-project/helpers/readState";
import type { WizardFormState } from "@/shared/core/wizard-form/wizardForm.reducer";

type SoilsDecontaminationSurfaceAreaViewData = {
  decontaminatedSurfaceArea: number | undefined;
  siteContaminatedSurfaceArea: number;
};

export const createSelectSoilsDecontaminationSurfaceAreaViewData = (
  selectStepState: Selector<RootState, WizardFormState["urbanProject"]["steps"]>,
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

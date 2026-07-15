import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store/store";
import { ReadStateHelper } from "@/shared/core/wizard-form/helpers/readState";
import type { WizardFormState } from "@/shared/core/wizard-form/wizardForm.reducer";

type PublicGreenSpacesSurfaceAreaViewData = {
  publicGreenSpacesSurfaceArea: number | undefined;
  siteSurfaceArea: number;
};

export const createSelectPublicGreenSpacesSurfaceAreaViewData = (
  selectStepState: Selector<RootState, WizardFormState["urbanProject"]["steps"]>,
  selectSiteSurfaceArea: Selector<RootState, number>,
) =>
  createSelector(
    [selectStepState, selectSiteSurfaceArea],
    (steps, siteSurfaceArea): PublicGreenSpacesSurfaceAreaViewData => {
      const answers =
        ReadStateHelper.getStepAnswers(steps, "URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA") ??
        ReadStateHelper.getDefaultAnswers(steps, "URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA");

      return {
        publicGreenSpacesSurfaceArea: answers?.publicGreenSpacesSurfaceArea,
        siteSurfaceArea,
      };
    },
  );

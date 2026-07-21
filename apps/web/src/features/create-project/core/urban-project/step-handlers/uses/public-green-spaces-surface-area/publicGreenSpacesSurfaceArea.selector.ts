import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store/store";
import type { UrbanProjectStepsState } from "@/features/create-project/core/urban-project/urbanProject.state";
import { ReadStateHelper } from "@/shared/core/wizard-form/helpers/readState";

type PublicGreenSpacesSurfaceAreaViewData = {
  publicGreenSpacesSurfaceArea: number | undefined;
  siteSurfaceArea: number;
};

export const createSelectPublicGreenSpacesSurfaceAreaViewData = (
  selectStepState: Selector<RootState, UrbanProjectStepsState>,
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

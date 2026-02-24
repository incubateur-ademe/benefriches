import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";

import type { ProjectFormState } from "@/shared/core/reducers/project-form/projectForm.reducer";
import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";
import type { RootState } from "@/shared/core/store-config/store";

type PublicGreenSpacesSurfaceAreaViewData = {
  publicGreenSpacesSurfaceArea: number | undefined;
  siteSurfaceArea: number;
};

export const createSelectPublicGreenSpacesSurfaceAreaViewData = (
  selectStepState: Selector<RootState, ProjectFormState["urbanProject"]["steps"]>,
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

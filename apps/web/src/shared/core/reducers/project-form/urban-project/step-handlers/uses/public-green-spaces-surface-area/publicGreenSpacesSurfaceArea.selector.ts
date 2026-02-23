import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";

import type { ProjectFormState } from "@/shared/core/reducers/project-form/projectForm.reducer";
import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";

export type PublicGreenSpacesSurfaceAreaViewData = {
  publicGreenSpacesSurfaceArea: number | undefined;
  siteSurfaceArea: number;
};

export const createSelectPublicGreenSpacesSurfaceAreaViewData = <S>(
  selectStepState: Selector<S, ProjectFormState["urbanProject"]["steps"]>,
  selectSiteSurfaceArea: Selector<S, number>,
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

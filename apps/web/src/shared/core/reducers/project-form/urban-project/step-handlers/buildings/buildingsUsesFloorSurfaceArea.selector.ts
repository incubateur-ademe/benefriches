import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";
import type { UrbanProjectUse, UrbanProjectUseDistribution } from "shared";

import type { ProjectFormState } from "@/shared/core/reducers/project-form/projectForm.reducer";
import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";

export type UsesFloorSurfaceAreaViewData = {
  usesFloorSurfaceAreaDistribution: UrbanProjectUseDistribution | undefined;
  selectedUses: UrbanProjectUse[];
  buildingsFootprintSurfaceArea: number | undefined;
};

export const createSelectUsesFloorSurfaceAreaViewData = <S>(
  selectStepState: Selector<S, ProjectFormState["urbanProject"]["steps"]>,
) =>
  createSelector([selectStepState], (steps): UsesFloorSurfaceAreaViewData => {
    const floorAnswers =
      ReadStateHelper.getStepAnswers(steps, "URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA") ??
      ReadStateHelper.getDefaultAnswers(steps, "URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA");

    const selectionAnswers = ReadStateHelper.getStepAnswers(steps, "URBAN_PROJECT_USES_SELECTION");

    const spacesAnswers =
      ReadStateHelper.getStepAnswers(steps, "URBAN_PROJECT_SPACES_SURFACE_AREA") ??
      ReadStateHelper.getDefaultAnswers(steps, "URBAN_PROJECT_SPACES_SURFACE_AREA");

    return {
      usesFloorSurfaceAreaDistribution: floorAnswers?.usesFloorSurfaceAreaDistribution,
      selectedUses: selectionAnswers?.usesSelection ?? [],
      buildingsFootprintSurfaceArea: spacesAnswers?.spacesSurfaceAreaDistribution?.BUILDINGS,
    };
  });

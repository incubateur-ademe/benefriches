import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";
import {
  doesUseIncludeBuildings,
  type BuildingsUseDistribution,
  type UrbanProjectUseWithBuilding,
} from "shared";

import type { RootState } from "@/app/store/store";
import type { WizardFormState } from "@/features/create-project/core/urban-project/urbanProjectForm.state";
import { ReadStateHelper } from "@/shared/core/wizard-form/helpers/readState";

type ExistingBuildingsUsesFloorSurfaceAreaViewData = {
  existingBuildingsUsesFloorSurfaceArea: BuildingsUseDistribution | undefined;
  selectedUses: UrbanProjectUseWithBuilding[];
  usesFloorSurfaceAreaDistribution: BuildingsUseDistribution;
};

export const createSelectExistingBuildingsUsesFloorSurfaceAreaViewData = (
  selectStepState: Selector<RootState, WizardFormState["urbanProject"]["steps"]>,
) =>
  createSelector([selectStepState], (steps): ExistingBuildingsUsesFloorSurfaceAreaViewData => {
    const existingUsesAnswers =
      ReadStateHelper.getStepAnswers(
        steps,
        "URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA",
      ) ??
      ReadStateHelper.getDefaultAnswers(
        steps,
        "URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA",
      );
    const selectionAnswers = ReadStateHelper.getStepAnswers(steps, "URBAN_PROJECT_USES_SELECTION");
    const floorAnswers =
      ReadStateHelper.getStepAnswers(steps, "URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA") ??
      ReadStateHelper.getDefaultAnswers(steps, "URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA");

    return {
      existingBuildingsUsesFloorSurfaceArea:
        existingUsesAnswers?.existingBuildingsUsesFloorSurfaceArea,
      selectedUses: (selectionAnswers?.usesSelection ?? []).filter(doesUseIncludeBuildings),
      usesFloorSurfaceAreaDistribution: floorAnswers?.usesFloorSurfaceAreaDistribution ?? {},
    };
  });

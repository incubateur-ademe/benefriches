import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";
import {
  doesUseIncludeBuildings,
  type BuildingsUseDistribution,
  type UrbanProjectUseWithBuilding,
} from "shared";

import type { RootState } from "@/app/store/store";
import type { ProjectFormState } from "@/shared/core/reducers/project-form/projectForm.reducer";
import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";

type NewBuildingsUsesFloorSurfaceAreaViewData = {
  newBuildingsUsesFloorSurfaceArea: BuildingsUseDistribution | undefined;
  selectedUses: UrbanProjectUseWithBuilding[];
  usesFloorSurfaceAreaDistribution: BuildingsUseDistribution;
  remainingUsesFloorSurfaceAreaDistribution: BuildingsUseDistribution;
};

export const createSelectNewBuildingsUsesFloorSurfaceAreaViewData = (
  selectStepState: Selector<RootState, ProjectFormState["urbanProject"]["steps"]>,
) =>
  createSelector([selectStepState], (steps): NewBuildingsUsesFloorSurfaceAreaViewData => {
    const newUsesAnswers =
      ReadStateHelper.getStepAnswers(
        steps,
        "URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA",
      ) ??
      ReadStateHelper.getDefaultAnswers(
        steps,
        "URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA",
      );
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

    const selectedUses = (selectionAnswers?.usesSelection ?? []).filter(doesUseIncludeBuildings);
    const usesFloorSurfaceAreaDistribution = floorAnswers?.usesFloorSurfaceAreaDistribution ?? {};
    const existingBuildingsUsesFloorSurfaceArea =
      existingUsesAnswers?.existingBuildingsUsesFloorSurfaceArea ?? {};

    const remainingUsesFloorSurfaceAreaDistribution = selectedUses.reduce<BuildingsUseDistribution>(
      (acc, use) => {
        const totalFloorSurfaceArea = usesFloorSurfaceAreaDistribution[use] ?? 0;
        const existingFloorSurfaceArea = existingBuildingsUsesFloorSurfaceArea[use] ?? 0;

        acc[use] = Math.max(0, totalFloorSurfaceArea - existingFloorSurfaceArea);
        return acc;
      },
      {},
    );

    const savedAnswers = newUsesAnswers?.newBuildingsUsesFloorSurfaceArea;
    const preFilledAnswers =
      selectedUses.length === 1
        ? ({
            [selectedUses[0]!]: remainingUsesFloorSurfaceAreaDistribution[selectedUses[0]!] ?? 0,
          } as BuildingsUseDistribution)
        : undefined;

    return {
      newBuildingsUsesFloorSurfaceArea: savedAnswers ?? preFilledAnswers,
      selectedUses,
      usesFloorSurfaceAreaDistribution,
      remainingUsesFloorSurfaceAreaDistribution,
    };
  });

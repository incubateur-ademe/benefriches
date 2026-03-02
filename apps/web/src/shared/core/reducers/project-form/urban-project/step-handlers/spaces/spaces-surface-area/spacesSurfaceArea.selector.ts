import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";
import { isConstrainedSoilType } from "shared";
import type { SoilsDistribution, SoilType, UrbanProjectUse } from "shared";

import type { RootState } from "@/app/store/store";
import type { ProjectFormState } from "@/shared/core/reducers/project-form/projectForm.reducer";
import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";

type SpaceConstraint = {
  soilType: SoilType;
  maxSurfaceArea: number;
};

type SpacesSurfaceAreaViewData = {
  selectedSpaces: SoilType[];
  spacesSurfaceAreaDistribution: Partial<Record<SoilType, number>> | undefined;
  totalSurfaceArea: number;
  spacesWithConstraints: SpaceConstraint[];
  nonGreenSpacesUses: UrbanProjectUse[];
  hasPublicGreenSpaces: boolean;
};

export const createSelectSpacesSurfaceAreaViewData = (
  selectStepState: Selector<RootState, ProjectFormState["urbanProject"]["steps"]>,
  selectSiteSurfaceArea: Selector<RootState, number>,
  selectSiteSoilsDistribution: Selector<RootState, SoilsDistribution>,
) =>
  createSelector(
    [selectStepState, selectSiteSurfaceArea, selectSiteSoilsDistribution],
    (steps, siteSurfaceArea, siteSoilsDistribution): SpacesSurfaceAreaViewData => {
      const surfaceAreaAnswers =
        ReadStateHelper.getStepAnswers(steps, "URBAN_PROJECT_SPACES_SURFACE_AREA") ??
        ReadStateHelper.getDefaultAnswers(steps, "URBAN_PROJECT_SPACES_SURFACE_AREA");

      const spacesSelectionAnswers = ReadStateHelper.getStepAnswers(
        steps,
        "URBAN_PROJECT_SPACES_SELECTION",
      );

      const selectedSpaces = spacesSelectionAnswers?.spacesSelection ?? [];

      const selectedUses =
        ReadStateHelper.getStepAnswers(steps, "URBAN_PROJECT_USES_SELECTION")?.usesSelection ?? [];

      const publicGreenSpacesSurfaceArea =
        ReadStateHelper.getStepAnswers(steps, "URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA")
          ?.publicGreenSpacesSurfaceArea ?? 0;

      // Compute constraints for constrained soils that exist on site
      const spacesWithConstraints: SpaceConstraint[] = selectedSpaces
        .filter((soilType) => isConstrainedSoilType(soilType))
        .map((soilType) => ({
          soilType,
          maxSurfaceArea: siteSoilsDistribution[soilType] ?? 0,
        }))
        .filter((constraint) => constraint.maxSurfaceArea > 0);

      return {
        selectedSpaces,
        spacesSurfaceAreaDistribution: surfaceAreaAnswers?.spacesSurfaceAreaDistribution,
        totalSurfaceArea: siteSurfaceArea - publicGreenSpacesSurfaceArea,
        spacesWithConstraints,
        nonGreenSpacesUses: selectedUses.filter(
          (use): use is UrbanProjectUse => use !== "PUBLIC_GREEN_SPACES",
        ),
        hasPublicGreenSpaces: selectedUses.includes("PUBLIC_GREEN_SPACES"),
      };
    },
  );

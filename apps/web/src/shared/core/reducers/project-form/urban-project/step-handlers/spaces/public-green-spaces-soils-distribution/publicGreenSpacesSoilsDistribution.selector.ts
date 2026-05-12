import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";
import { isConstrainedSoilType, isNaturalSoil, ORDERED_SOIL_TYPES, typedObjectKeys } from "shared";
import type { SoilsDistribution, SoilType } from "shared";

import type { RootState } from "@/app/store/store";
import type { ProjectFormState } from "@/shared/core/reducers/project-form/projectForm.reducer";
import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";

type SpaceConstraint = {
  soilType: SoilType;
  maxSurfaceArea: number;
};

// Overrides ORDERED_SOIL_TYPES for the public green spaces form
const PUBLIC_GREEN_SPACES_DISPLAY_ORDER: readonly SoilType[] = [
  "ARTIFICIAL_TREE_FILLED",
  "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
  "MINERAL_SOIL",
  "IMPERMEABLE_SOILS",
  ...ORDERED_SOIL_TYPES.filter(
    (soilType) =>
      ![
        "ARTIFICIAL_TREE_FILLED",
        "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
        "MINERAL_SOIL",
        "IMPERMEABLE_SOILS",
      ].includes(soilType),
  ),
];

type PublicGreenSpacesSoilsDistributionViewData = {
  availableSoilTypes: SoilType[];
  publicGreenSpacesSoilsDistribution: Partial<Record<SoilType, number>> | undefined;
  totalSurfaceArea: number;
  existingNaturalSoilsConstraints: SpaceConstraint[];
};

export const createSelectPublicGreenSpacesSoilsDistributionViewData = (
  selectStepState: Selector<RootState, ProjectFormState["urbanProject"]["steps"]>,
  selectSiteSoilsDistribution: Selector<RootState, SoilsDistribution>,
) =>
  createSelector(
    [selectStepState, selectSiteSoilsDistribution],
    (steps, siteSoilsDistribution): PublicGreenSpacesSoilsDistributionViewData => {
      const distributionAnswers =
        ReadStateHelper.getStepAnswers(
          steps,
          "URBAN_PROJECT_PUBLIC_GREEN_SPACES_SOILS_DISTRIBUTION",
        ) ??
        ReadStateHelper.getDefaultAnswers(
          steps,
          "URBAN_PROJECT_PUBLIC_GREEN_SPACES_SOILS_DISTRIBUTION",
        );

      const totalSurfaceArea =
        ReadStateHelper.getStepAnswers(steps, "URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA")
          ?.publicGreenSpacesSurfaceArea ?? 0;

      const siteSoils = typedObjectKeys(siteSoilsDistribution);
      const existingProjectSoils = typedObjectKeys(
        distributionAnswers?.publicGreenSpacesSoilsDistribution ?? {},
      );

      // All soil types except BUILDINGS, with constrained soils filtered to only those on site or already in project
      const availableSoilTypes = PUBLIC_GREEN_SPACES_DISPLAY_ORDER.filter((soilType) => {
        if (soilType === "BUILDINGS") return false;
        if (!isConstrainedSoilType(soilType)) return true;
        return siteSoils.includes(soilType) || existingProjectSoils.includes(soilType);
      });

      const existingNaturalSoilsConstraints: SpaceConstraint[] = availableSoilTypes
        .filter(isNaturalSoil)
        .map((soilType) => ({
          soilType,
          maxSurfaceArea: siteSoilsDistribution[soilType] ?? 0,
        }));

      return {
        availableSoilTypes,
        publicGreenSpacesSoilsDistribution: distributionAnswers?.publicGreenSpacesSoilsDistribution,
        totalSurfaceArea,
        existingNaturalSoilsConstraints,
      };
    },
  );

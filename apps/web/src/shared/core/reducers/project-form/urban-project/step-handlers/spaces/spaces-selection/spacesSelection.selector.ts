import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";
import { isConstrainedSoilType, ORDERED_SOIL_TYPES } from "shared";
import type { SoilsDistribution, SoilType, UrbanProjectUse } from "shared";

import type { ProjectFormState } from "@/shared/core/reducers/project-form/projectForm.reducer";
import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";
import type { RootState } from "@/shared/core/store-config/store";

/**
 * Computes the list of soils that can be selected for the project.
 * Non-constrained soils (BUILDINGS, IMPERMEABLE_SOILS, MINERAL_SOIL, ARTIFICIAL_*)
 * are always selectable. Constrained soils (forests, prairies, agricultural, wetlands)
 * are only selectable if they already exist on the site.
 */
const computeSelectableSoils = (siteSoilsDistribution: SoilsDistribution): SoilType[] => {
  const siteSoils = Object.keys(siteSoilsDistribution) as SoilType[];

  return ORDERED_SOIL_TYPES.filter((soilType) => {
    // Non-constrained soils are always selectable
    if (!isConstrainedSoilType(soilType)) {
      return true;
    }
    // Constrained soils are only selectable if they exist on the site
    return siteSoils.includes(soilType);
  });
};

export type SpacesSelectionViewData = {
  selectedSpaces: SoilType[];
  selectableSoils: SoilType[];
  nonGreenSpacesUses: UrbanProjectUse[];
  hasPublicGreenSpaces: boolean;
};

export const createSelectSpacesSelectionViewData = (
  selectStepState: Selector<RootState, ProjectFormState["urbanProject"]["steps"]>,
  selectSiteSoilsDistribution: Selector<RootState, SoilsDistribution>,
) =>
  createSelector(
    [selectStepState, selectSiteSoilsDistribution],
    (steps, siteSoilsDistribution): SpacesSelectionViewData => {
      const spacesAnswers =
        ReadStateHelper.getStepAnswers(steps, "URBAN_PROJECT_SPACES_SELECTION") ??
        ReadStateHelper.getDefaultAnswers(steps, "URBAN_PROJECT_SPACES_SELECTION");

      const selectedUses =
        ReadStateHelper.getStepAnswers(steps, "URBAN_PROJECT_USES_SELECTION")?.usesSelection ?? [];

      return {
        selectedSpaces: spacesAnswers?.spacesSelection ?? [],
        selectableSoils: computeSelectableSoils(siteSoilsDistribution),
        nonGreenSpacesUses: selectedUses.filter(
          (use): use is UrbanProjectUse => use !== "PUBLIC_GREEN_SPACES",
        ),
        hasPublicGreenSpaces: selectedUses.includes("PUBLIC_GREEN_SPACES"),
      };
    },
  );

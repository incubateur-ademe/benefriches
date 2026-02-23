import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";
import { isNaturalSoil, typedObjectEntries } from "shared";
import type { SoilsDistribution, SoilType } from "shared";

export type PublicGreenSpacesIntroductionViewData = {
  existingNaturalSoils: { soilType: SoilType; surfaceArea: number }[];
};

export const createSelectPublicGreenSpacesIntroductionViewData = <S>(
  selectSiteSoilsDistribution: Selector<S, SoilsDistribution>,
) =>
  createSelector(
    [selectSiteSoilsDistribution],
    (siteSoilsDistribution): PublicGreenSpacesIntroductionViewData => {
      const existingNaturalSoils = typedObjectEntries(siteSoilsDistribution)
        .filter(([soilType]) => isNaturalSoil(soilType))
        .map(([soilType, surfaceArea]) => ({ soilType, surfaceArea: surfaceArea ?? 0 }));

      return { existingNaturalSoils };
    },
  );

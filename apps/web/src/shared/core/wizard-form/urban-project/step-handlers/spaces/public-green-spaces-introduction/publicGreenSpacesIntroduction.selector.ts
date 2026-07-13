import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";
import { isNaturalSoil, typedObjectEntries } from "shared";
import type { SoilsDistribution, SoilType } from "shared";

import type { RootState } from "@/app/store/store";

type PublicGreenSpacesIntroductionViewData = {
  existingNaturalSoils: { soilType: SoilType; surfaceArea: number }[];
};

export const createSelectPublicGreenSpacesIntroductionViewData = (
  selectSiteSoilsDistribution: Selector<RootState, SoilsDistribution>,
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

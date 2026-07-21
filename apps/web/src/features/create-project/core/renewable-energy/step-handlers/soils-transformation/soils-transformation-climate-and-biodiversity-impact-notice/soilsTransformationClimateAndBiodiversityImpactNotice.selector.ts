import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store/store";

type PVClimateAndBiodiversityImpactNoticeViewData = {
  hasTransformationNegativeImpact: boolean;
  biodiversityAndClimateSensitiveSoilsSurfaceAreaDestroyed: number;
  futureBiodiversityAndClimateSensitiveSoilsSurfaceArea: number;
};

export const createSelectPVClimateAndBiodiversityImpactNoticeViewData = (
  selectWillSoilsTransformationHaveNegativeImpactOnBiodiversityAndClimate: Selector<
    RootState,
    boolean
  >,
  selectBiodiversityAndClimateSensibleSoilsSurfaceAreaDestroyed: Selector<RootState, number>,
  selectFutureBiodiversityAndClimateSensibleSoilsSurfaceArea: Selector<RootState, number>,
) =>
  createSelector(
    [
      selectWillSoilsTransformationHaveNegativeImpactOnBiodiversityAndClimate,
      selectBiodiversityAndClimateSensibleSoilsSurfaceAreaDestroyed,
      selectFutureBiodiversityAndClimateSensibleSoilsSurfaceArea,
    ],
    (
      hasTransformationNegativeImpact,
      biodiversityAndClimateSensitiveSoilsSurfaceAreaDestroyed,
      futureBiodiversityAndClimateSensitiveSoilsSurfaceArea,
    ): PVClimateAndBiodiversityImpactNoticeViewData => ({
      hasTransformationNegativeImpact,
      biodiversityAndClimateSensitiveSoilsSurfaceAreaDestroyed,
      futureBiodiversityAndClimateSensitiveSoilsSurfaceArea,
    }),
  );

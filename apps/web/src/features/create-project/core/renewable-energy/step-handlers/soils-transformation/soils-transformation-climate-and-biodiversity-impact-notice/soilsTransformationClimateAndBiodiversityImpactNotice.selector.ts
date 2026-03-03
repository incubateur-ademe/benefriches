import { createSelector } from "@reduxjs/toolkit";

import {
  selectBiodiversityAndClimateSensibleSoilsSurfaceAreaDestroyed,
  selectFutureBiodiversityAndClimateSensibleSoilsSurfaceArea,
  selectWillSoilsTransformationHaveNegativeImpactOnBiodiversityAndClimate,
} from "../../../selectors/soilsTransformation.selectors";

type PVClimateAndBiodiversityImpactNoticeViewData = {
  hasTransformationNegativeImpact: boolean;
  biodiversityAndClimateSensitiveSoilsSurfaceAreaDestroyed: number;
  futureBiodiversityAndClimateSensitiveSoilsSurfaceArea: number;
};

export const selectPVClimateAndBiodiversityImpactNoticeViewData = createSelector(
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

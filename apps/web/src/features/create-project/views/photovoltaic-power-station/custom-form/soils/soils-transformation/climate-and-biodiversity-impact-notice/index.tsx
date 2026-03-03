import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  navigateToNext,
  navigateToPrevious,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";
import { selectPVClimateAndBiodiversityImpactNoticeViewData } from "@/features/create-project/core/renewable-energy/step-handlers/soils-transformation/climateAndBiodiversityImpactNotice.selector";

import ClimateAndBiodiversityImpactNotice from "./ClimateAndBiodiversityImpactNotice";

export default function ClimateAndBiodiversityImpactNoticeContainer() {
  const dispatch = useAppDispatch();
  const {
    hasTransformationNegativeImpact,
    biodiversityAndClimateSensitiveSoilsSurfaceAreaDestroyed,
    futureBiodiversityAndClimateSensitiveSoilsSurfaceArea,
  } = useAppSelector(selectPVClimateAndBiodiversityImpactNoticeViewData);

  return (
    <ClimateAndBiodiversityImpactNotice
      onBack={() => dispatch(navigateToPrevious())}
      onNext={() => dispatch(navigateToNext())}
      hasTransformationNegativeImpact={hasTransformationNegativeImpact}
      sensibleSurfaceAreaDestroyed={biodiversityAndClimateSensitiveSoilsSurfaceAreaDestroyed}
      futureBiodiversityAndClimateSensitiveSoilsSurfaceArea={
        futureBiodiversityAndClimateSensitiveSoilsSurfaceArea
      }
    />
  );
}

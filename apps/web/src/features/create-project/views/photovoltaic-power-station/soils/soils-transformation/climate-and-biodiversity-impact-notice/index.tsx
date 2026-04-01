import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  nextStepRequested,
  previousStepRequested,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";
import { selectPVClimateAndBiodiversityImpactNoticeViewData } from "@/features/create-project/core/renewable-energy/step-handlers/soils-transformation/soils-transformation-climate-and-biodiversity-impact-notice/soilsTransformationClimateAndBiodiversityImpactNotice.selector";

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
      onBack={() => dispatch(previousStepRequested())}
      onNext={() => dispatch(nextStepRequested())}
      hasTransformationNegativeImpact={hasTransformationNegativeImpact}
      sensibleSurfaceAreaDestroyed={biodiversityAndClimateSensitiveSoilsSurfaceAreaDestroyed}
      futureBiodiversityAndClimateSensitiveSoilsSurfaceArea={
        futureBiodiversityAndClimateSensitiveSoilsSurfaceArea
      }
    />
  );
}

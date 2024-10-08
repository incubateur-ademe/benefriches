import {
  completeSoilsTransformationClimateAndBiodiversityImpactNoticeStep,
  revertBiodiversityAndClimateImpactNoticeStep,
} from "@/features/create-project/application/createProject.reducer";
import {
  selectBiodiversityAndClimateSensibleSoilsSurfaceAreaDestroyed,
  selectFutureBiodiversityAndClimateSensibleSoilsSurfaceArea,
  selectWillSoilsTransformationHaveNegativeImpactOnBiodiversityAndClimate,
} from "@/features/create-project/application/createProject.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import ClimateAndBiodiversityImpactNotice from "./ClimateAndBiodiversityImpactNotice";

export default function ClimateAndBiodiversityImpactNoticeContainer() {
  const dispatch = useAppDispatch();
  const hasTransformationNegativeImpact = useAppSelector(
    selectWillSoilsTransformationHaveNegativeImpactOnBiodiversityAndClimate,
  );
  const biodiversityAndClimateSensitiveSoilsSurfaceAreaDestroyed = useAppSelector(
    selectBiodiversityAndClimateSensibleSoilsSurfaceAreaDestroyed,
  );
  const futureBiodiversityAndClimateSensitiveSoilsSurfaceArea = useAppSelector(
    selectFutureBiodiversityAndClimateSensibleSoilsSurfaceArea,
  );

  return (
    <ClimateAndBiodiversityImpactNotice
      onBack={() => dispatch(revertBiodiversityAndClimateImpactNoticeStep())}
      onNext={() => dispatch(completeSoilsTransformationClimateAndBiodiversityImpactNoticeStep())}
      hasTransformationNegativeImpact={hasTransformationNegativeImpact}
      sensibleSurfaceAreaDestroyed={biodiversityAndClimateSensitiveSoilsSurfaceAreaDestroyed}
      futureBiodiversityAndClimateSensitiveSoilsSurfaceArea={
        futureBiodiversityAndClimateSensitiveSoilsSurfaceArea
      }
    />
  );
}

import { completeSoilsTransformationClimateAndBiodiversityImpactNoticeStep } from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import { biodiversityAndClimateImpactNoticeStepReverted } from "@/features/create-project/core/renewable-energy/actions/revert.actions";
import {
  selectBiodiversityAndClimateSensibleSoilsSurfaceAreaDestroyed,
  selectFutureBiodiversityAndClimateSensibleSoilsSurfaceArea,
  selectWillSoilsTransformationHaveNegativeImpactOnBiodiversityAndClimate,
} from "@/features/create-project/core/renewable-energy/selectors/soilsTransformation.selectors";
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
      onBack={() => dispatch(biodiversityAndClimateImpactNoticeStepReverted())}
      onNext={() => dispatch(completeSoilsTransformationClimateAndBiodiversityImpactNoticeStep())}
      hasTransformationNegativeImpact={hasTransformationNegativeImpact}
      sensibleSurfaceAreaDestroyed={biodiversityAndClimateSensitiveSoilsSurfaceAreaDestroyed}
      futureBiodiversityAndClimateSensitiveSoilsSurfaceArea={
        futureBiodiversityAndClimateSensitiveSoilsSurfaceArea
      }
    />
  );
}

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { stepReverted } from "@/features/create-project/core/actions/actionsUtils";
import { completeSoilsTransformationClimateAndBiodiversityImpactNoticeStep } from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import {
  selectBiodiversityAndClimateSensibleSoilsSurfaceAreaDestroyed,
  selectFutureBiodiversityAndClimateSensibleSoilsSurfaceArea,
  selectWillSoilsTransformationHaveNegativeImpactOnBiodiversityAndClimate,
} from "@/features/create-project/core/renewable-energy/selectors/soilsTransformation.selectors";

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
      onBack={() => dispatch(stepReverted())}
      onNext={() => dispatch(completeSoilsTransformationClimateAndBiodiversityImpactNoticeStep())}
      hasTransformationNegativeImpact={hasTransformationNegativeImpact}
      sensibleSurfaceAreaDestroyed={biodiversityAndClimateSensitiveSoilsSurfaceAreaDestroyed}
      futureBiodiversityAndClimateSensitiveSoilsSurfaceArea={
        futureBiodiversityAndClimateSensitiveSoilsSurfaceArea
      }
    />
  );
}

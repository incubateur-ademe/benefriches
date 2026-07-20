import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import ClimateAndBiodiversityImpactNotice from "@/features/create-project/views/photovoltaic-power-station/soils/soils-transformation/climate-and-biodiversity-impact-notice/ClimateAndBiodiversityImpactNotice";
import { updateProjectFormRenewableEnergyActions } from "@/features/update-project/core/updateProject.actions";
import { selectPVClimateAndBiodiversityImpactNoticeViewData } from "@/features/update-project/core/updateProjectRenewableEnergy.selectors";

export default function ClimateAndBiodiversityImpactNoticeContainer() {
  const dispatch = useAppDispatch();
  const {
    hasTransformationNegativeImpact,
    biodiversityAndClimateSensitiveSoilsSurfaceAreaDestroyed,
    futureBiodiversityAndClimateSensitiveSoilsSurfaceArea,
  } = useAppSelector(selectPVClimateAndBiodiversityImpactNoticeViewData);

  return (
    <ClimateAndBiodiversityImpactNotice
      onBack={() => dispatch(updateProjectFormRenewableEnergyActions.previousStepRequested())}
      onNext={() => dispatch(updateProjectFormRenewableEnergyActions.nextStepRequested())}
      hasTransformationNegativeImpact={hasTransformationNegativeImpact}
      sensibleSurfaceAreaDestroyed={biodiversityAndClimateSensitiveSoilsSurfaceAreaDestroyed}
      futureBiodiversityAndClimateSensitiveSoilsSurfaceArea={
        futureBiodiversityAndClimateSensitiveSoilsSurfaceArea
      }
    />
  );
}

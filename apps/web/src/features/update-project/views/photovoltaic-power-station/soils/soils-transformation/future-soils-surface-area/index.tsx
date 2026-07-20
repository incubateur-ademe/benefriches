import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import FutureSoilsSurfaceAreaForm, {
  FormValues,
} from "@/features/create-project/views/photovoltaic-power-station/soils/soils-transformation/future-soils-surface-area/FutureSoilsSurfaceAreaForm";
import { updateProjectFormRenewableEnergyActions } from "@/features/update-project/core/updateProject.actions";
import { selectFutureSoilsSurfaceAreasViewData } from "@/features/update-project/core/updateProjectRenewableEnergy.selectors";

function FutureSoilsSurfaceAreaFormContainer() {
  const dispatch = useAppDispatch();
  const {
    initialValues,
    baseSoilsDistribution,
    photovoltaicPanelsSurfaceArea,
    siteSurfaceArea,
    selectedSoils,
  } = useAppSelector(selectFutureSoilsSurfaceAreasViewData);

  return (
    <FutureSoilsSurfaceAreaForm
      initialValues={initialValues}
      selectedSoils={selectedSoils}
      siteSurfaceArea={siteSurfaceArea}
      currentSoilsDistribution={baseSoilsDistribution}
      photovoltaicPanelsSurfaceArea={photovoltaicPanelsSurfaceArea}
      onSubmit={(data: FormValues) => {
        dispatch(
          updateProjectFormRenewableEnergyActions.stepCompletionRequested({
            stepId: "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION",
            answers: { soilsDistribution: data },
          }),
        );
      }}
      onBack={() => {
        dispatch(updateProjectFormRenewableEnergyActions.previousStepRequested());
      }}
    />
  );
}

export default FutureSoilsSurfaceAreaFormContainer;

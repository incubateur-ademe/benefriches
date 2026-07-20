import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import NonSuitableSoilsSurfaceForm, {
  FormValues,
} from "@/features/create-project/views/photovoltaic-power-station/soils/soils-transformation/non-suitable-soils-surface-to-transform/NonSuitableSoilsSurfaceToTransformForm";
import { updateProjectFormRenewableEnergyActions } from "@/features/update-project/core/updateProject.actions";
import { selectNonSuitableSoilsSurfaceAreaToTransformViewData } from "@/features/update-project/core/updateProjectRenewableEnergy.selectors";

function NonSuitableSoilsSurfaceFormContainer() {
  const dispatch = useAppDispatch();
  const { initialValues, soilsToTransform, missingSuitableSurfaceArea } = useAppSelector(
    selectNonSuitableSoilsSurfaceAreaToTransformViewData,
  );

  return (
    <NonSuitableSoilsSurfaceForm
      initialValues={{ soilsTransformation: initialValues }}
      soilsToTransform={soilsToTransform}
      missingSuitableSurfaceArea={missingSuitableSurfaceArea}
      onSubmit={(data: FormValues) => {
        dispatch(
          updateProjectFormRenewableEnergyActions.stepCompletionRequested({
            stepId: "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SURFACE",
            answers: { nonSuitableSoilsSurfaceAreaToTransform: data.soilsTransformation },
          }),
        );
      }}
      onBack={() => {
        dispatch(updateProjectFormRenewableEnergyActions.previousStepRequested());
      }}
    />
  );
}

export default NonSuitableSoilsSurfaceFormContainer;

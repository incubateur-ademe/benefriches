import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import NonSuitableSoilsSelection, {
  FormValues,
} from "@/features/create-project/views/photovoltaic-power-station/soils/soils-transformation/non-suitable-soils-selection/NonSuitableSoilsSelection";
import { updateProjectFormRenewableEnergyActions } from "@/features/update-project/core/updateProject.actions";
import { selectNonSuitableSelectionViewData } from "@/features/update-project/core/updateProjectRenewableEnergy.selectors";

function NonSuitableSoilsSelectionContainer() {
  const dispatch = useAppDispatch();
  const { initialValues, nonSuitableSoils, missingSuitableSurfaceArea } = useAppSelector(
    selectNonSuitableSelectionViewData,
  );

  return (
    <NonSuitableSoilsSelection
      initialValues={initialValues}
      nonSuitableSoils={nonSuitableSoils}
      missingSuitableSurfaceArea={missingSuitableSurfaceArea}
      onSubmit={(data: FormValues) => {
        dispatch(
          updateProjectFormRenewableEnergyActions.stepCompletionRequested({
            stepId: "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SELECTION",
            answers: { nonSuitableSoilsToTransform: data.soils },
          }),
        );
      }}
      onBack={() => {
        dispatch(updateProjectFormRenewableEnergyActions.previousStepRequested());
      }}
    />
  );
}

export default NonSuitableSoilsSelectionContainer;

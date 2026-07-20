import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import FutureSoilsSelectionForm, {
  FormValues,
} from "@/features/create-project/views/photovoltaic-power-station/soils/soils-transformation/future-soils-selection/FutureSoilsSelectionForm";
import { updateProjectFormRenewableEnergyActions } from "@/features/update-project/core/updateProject.actions";
import { selectFutureSoilsSelectionViewData } from "@/features/update-project/core/updateProjectRenewableEnergy.selectors";

function FutureSoilsSelectionFormContainer() {
  const dispatch = useAppDispatch();
  const { initialValues, selectableSoils, baseSoilsDistribution } = useAppSelector(
    selectFutureSoilsSelectionViewData,
  );

  return (
    <FutureSoilsSelectionForm
      initialValues={{ soils: initialValues }}
      selectableSoils={selectableSoils}
      currentSoilsDistribution={baseSoilsDistribution}
      onSubmit={(data: FormValues) => {
        dispatch(
          updateProjectFormRenewableEnergyActions.stepCompletionRequested({
            stepId: "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SOILS_SELECTION",
            answers: { futureSoilsSelection: data.soils },
          }),
        );
      }}
      onBack={() => {
        dispatch(updateProjectFormRenewableEnergyActions.previousStepRequested());
      }}
    />
  );
}

export default FutureSoilsSelectionFormContainer;

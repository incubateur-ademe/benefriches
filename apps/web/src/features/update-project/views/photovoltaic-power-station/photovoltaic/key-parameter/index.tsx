import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import PhotovoltaicKeyParameterForm from "@/features/create-project/views/photovoltaic-power-station/photovoltaic/key-parameter/KeyParameterForm";
import { updateProjectFormRenewableEnergyActions } from "@/features/update-project/core/updateProject.actions";
import { selectPhotovoltaicPlantFeaturesKeyParameter } from "@/features/update-project/core/updateProjectRenewableEnergy.selectors";

function PhotovoltaicKeyParameterContainer() {
  const dispatch = useAppDispatch();
  const initialValue = useAppSelector(selectPhotovoltaicPlantFeaturesKeyParameter);

  return (
    <PhotovoltaicKeyParameterForm
      initialValues={initialValue ? { photovoltaicKeyParameter: initialValue } : undefined}
      onSubmit={(data) => {
        dispatch(
          updateProjectFormRenewableEnergyActions.stepCompletionRequested({
            stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER",
            answers: { photovoltaicKeyParameter: data.photovoltaicKeyParameter },
          }),
        );
      }}
      onBack={() => dispatch(updateProjectFormRenewableEnergyActions.previousStepRequested())}
    />
  );
}

export default PhotovoltaicKeyParameterContainer;

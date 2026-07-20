import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import PhotovoltaicContractDurationForm from "@/features/create-project/views/photovoltaic-power-station/photovoltaic/contract-duration/ContractDurationForm";
import { updateProjectFormRenewableEnergyActions } from "@/features/update-project/core/updateProject.actions";
import { selectContractDurationViewData } from "@/features/update-project/core/updateProjectRenewableEnergy.selectors";

function PhotovoltaicContractDurationContainer() {
  const dispatch = useAppDispatch();
  const { initialValues } = useAppSelector(selectContractDurationViewData);
  return (
    <PhotovoltaicContractDurationForm
      initialValues={initialValues}
      onSubmit={(data) => {
        dispatch(
          updateProjectFormRenewableEnergyActions.stepCompletionRequested({
            stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_CONTRACT_DURATION",
            answers: { photovoltaicContractDuration: data.photovoltaicContractDuration },
          }),
        );
      }}
      onBack={() => dispatch(updateProjectFormRenewableEnergyActions.previousStepRequested())}
    />
  );
}

export default PhotovoltaicContractDurationContainer;

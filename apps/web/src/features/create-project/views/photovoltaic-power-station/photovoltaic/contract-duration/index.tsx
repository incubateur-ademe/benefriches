import { useAppSelector } from "@/app/hooks/store.hooks";
import { useRenewableEnergyForm } from "@/features/create-project/views/photovoltaic-power-station/renewable-energy-form/useRenewableEnergyForm";

import PhotovoltaicContractDurationForm from "./ContractDurationForm";

function PhotovoltaicContractDurationContainer() {
  const { onBack, onRequestStepCompletion, selectContractDurationViewData } =
    useRenewableEnergyForm();
  const { initialValues } = useAppSelector(selectContractDurationViewData);
  return (
    <PhotovoltaicContractDurationForm
      initialValues={initialValues}
      onSubmit={(data) => {
        onRequestStepCompletion({
          stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_CONTRACT_DURATION",
          answers: { photovoltaicContractDuration: data.photovoltaicContractDuration },
        });
      }}
      onBack={onBack}
    />
  );
}

export default PhotovoltaicContractDurationContainer;

import { useAppSelector } from "@/app/hooks/store.hooks";
import { useRenewableEnergyForm } from "@/features/create-project/views/photovoltaic-power-station/renewable-energy-form/useRenewableEnergyForm";

import PhotovoltaicKeyParameterForm from "./KeyParameterForm";

function PhotovoltaicKeyParameterContainer() {
  const { onBack, onRequestStepCompletion, selectPhotovoltaicPlantFeaturesKeyParameter } =
    useRenewableEnergyForm();
  const initialValue = useAppSelector(selectPhotovoltaicPlantFeaturesKeyParameter);

  return (
    <PhotovoltaicKeyParameterForm
      initialValues={initialValue ? { photovoltaicKeyParameter: initialValue } : undefined}
      onSubmit={(data) => {
        onRequestStepCompletion({
          stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER",
          answers: { photovoltaicKeyParameter: data.photovoltaicKeyParameter },
        });
      }}
      onBack={onBack}
    />
  );
}

export default PhotovoltaicKeyParameterContainer;

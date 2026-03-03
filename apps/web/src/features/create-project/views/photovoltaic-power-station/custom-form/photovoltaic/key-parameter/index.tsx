import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  navigateToPrevious,
  requestStepCompletion,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";
import { selectPhotovoltaicPlantFeaturesKeyParameter } from "@/features/create-project/core/renewable-energy/step-handlers/photovoltaic/photovoltaic-key-parameter/photovoltaicKeyParameter.selector";

import PhotovoltaicKeyParameterForm from "./KeyParameterForm";

function PhotovoltaicKeyParameterContainer() {
  const dispatch = useAppDispatch();
  const initialValue = useAppSelector(selectPhotovoltaicPlantFeaturesKeyParameter);

  return (
    <PhotovoltaicKeyParameterForm
      initialValues={initialValue ? { photovoltaicKeyParameter: initialValue } : undefined}
      onSubmit={(data) => {
        dispatch(
          requestStepCompletion({
            stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER",
            answers: { photovoltaicKeyParameter: data.photovoltaicKeyParameter },
          }),
        );
      }}
      onBack={() => dispatch(navigateToPrevious())}
    />
  );
}

export default PhotovoltaicKeyParameterContainer;

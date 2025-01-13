import { selectPhotovoltaicPlantFeaturesKeyParameter } from "@/features/create-project/application/renewable-energy/photovoltaicPowerStation.selectors";
import {
  completePhotovoltaicKeyParameter,
  revertPhotovoltaicKeyParameter,
} from "@/features/create-project/application/renewable-energy/renewableEnergy.actions";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import PhotovoltaicKeyParameterForm from "./KeyParameterForm";

function PhotovoltaicKeyParameterContainer() {
  const dispatch = useAppDispatch();
  const initialValue = useAppSelector(selectPhotovoltaicPlantFeaturesKeyParameter);

  return (
    <PhotovoltaicKeyParameterForm
      initialValues={initialValue ? { photovoltaicKeyParameter: initialValue } : undefined}
      onSubmit={(data) => {
        dispatch(completePhotovoltaicKeyParameter(data.photovoltaicKeyParameter));
      }}
      onBack={() => dispatch(revertPhotovoltaicKeyParameter())}
    />
  );
}

export default PhotovoltaicKeyParameterContainer;

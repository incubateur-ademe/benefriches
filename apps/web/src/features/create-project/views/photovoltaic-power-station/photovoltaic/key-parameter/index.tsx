import { completePhotovoltaicKeyParameter } from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import { photovoltaicKeyParameterStepReverted } from "@/features/create-project/core/renewable-energy/actions/revert.actions";
import { selectPhotovoltaicPlantFeaturesKeyParameter } from "@/features/create-project/core/renewable-energy/selectors/photovoltaicPowerStation.selectors";
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
      onBack={() => dispatch(photovoltaicKeyParameterStepReverted())}
    />
  );
}

export default PhotovoltaicKeyParameterContainer;

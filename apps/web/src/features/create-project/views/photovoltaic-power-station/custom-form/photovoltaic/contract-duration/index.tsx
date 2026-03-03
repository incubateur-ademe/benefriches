import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  navigateToPrevious,
  requestStepCompletion,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";
import { selectContractDurationViewData } from "@/features/create-project/core/renewable-energy/step-handlers/photovoltaic/photovoltaic-contract-duration/photovoltaicContractDuration.selectors";

import PhotovoltaicContractDurationForm from "./ContractDurationForm";

function PhotovoltaicContractDurationContainer() {
  const dispatch = useAppDispatch();
  const { initialValues } = useAppSelector(selectContractDurationViewData);
  return (
    <PhotovoltaicContractDurationForm
      initialValues={initialValues}
      onSubmit={(data) => {
        dispatch(
          requestStepCompletion({
            stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_CONTRACT_DURATION",
            answers: { photovoltaicContractDuration: data.photovoltaicContractDuration },
          }),
        );
      }}
      onBack={() => dispatch(navigateToPrevious())}
    />
  );
}

export default PhotovoltaicContractDurationContainer;

import {
  completePhotovoltaicContractDuration,
  revertPhotovoltaicContractDuration,
} from "@/features/create-project/application/renewable-energy/renewableEnergy.actions";
import { selectCreationData } from "@/features/create-project/application/renewable-energy/renewableEnergy.selector";
import { AVERAGE_PHOTOVOLTAIC_CONTRACT_DURATION_IN_YEARS } from "@/features/create-project/domain/photovoltaic";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import PhotovoltaicContractDurationForm from "./ContractDurationForm";

function PhotovoltaicContractDurationContainer() {
  const dispatch = useAppDispatch();
  const { photovoltaicContractDuration: initialValue } = useAppSelector(selectCreationData);
  return (
    <PhotovoltaicContractDurationForm
      initialValues={{
        photovoltaicContractDuration:
          initialValue ?? AVERAGE_PHOTOVOLTAIC_CONTRACT_DURATION_IN_YEARS,
      }}
      onSubmit={(data) => {
        dispatch(completePhotovoltaicContractDuration(data.photovoltaicContractDuration));
      }}
      onBack={() => dispatch(revertPhotovoltaicContractDuration())}
    />
  );
}

export default PhotovoltaicContractDurationContainer;

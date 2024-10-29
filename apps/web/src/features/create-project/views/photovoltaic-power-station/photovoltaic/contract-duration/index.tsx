import {
  completePhotovoltaicContractDuration,
  revertPhotovoltaicContractDuration,
} from "@/features/create-project/application/renewable-energy/renewableEnergy.actions";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import PhotovoltaicContractDurationForm from "./ContractDurationForm";

function PhotovoltaicContractDurationContainer() {
  const dispatch = useAppDispatch();
  return (
    <PhotovoltaicContractDurationForm
      onSubmit={(data) => {
        dispatch(completePhotovoltaicContractDuration(data.photovoltaicContractDuration));
      }}
      onBack={() => dispatch(revertPhotovoltaicContractDuration())}
    />
  );
}

export default PhotovoltaicContractDurationContainer;

import PhotovoltaicContractDurationForm from "./ContractDurationForm";

import { completePhotovoltaicContractDuration } from "@/features/create-project/application/createProject.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

function PhotovoltaicContractDurationContainer() {
  const dispatch = useAppDispatch();
  return (
    <PhotovoltaicContractDurationForm
      onSubmit={(data) => {
        dispatch(completePhotovoltaicContractDuration(data.photovoltaicContractDuration));
      }}
    />
  );
}

export default PhotovoltaicContractDurationContainer;

import PhotovoltaicContractDurationForm from "./ContractDurationForm";

import {
  goToStep,
  ProjectCreationStep,
  setPhotovoltaicContractDuration,
} from "@/features/create-project/application/createProject.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

const AVERAGE_CONTRACT_DURATION = 20;

function PhotovoltaicContractDurationContainer() {
  const dispatch = useAppDispatch();
  return (
    <PhotovoltaicContractDurationForm
      suggestedContractDuration={AVERAGE_CONTRACT_DURATION}
      onSubmit={(data) => {
        dispatch(
          setPhotovoltaicContractDuration(data.photovoltaic.contractDuration),
        );
        dispatch(
          goToStep(ProjectCreationStep.PHOTOVOLTAIC_INFRASTRUCTURES_SURFACE),
        );
      }}
    />
  );
}

export default PhotovoltaicContractDurationContainer;

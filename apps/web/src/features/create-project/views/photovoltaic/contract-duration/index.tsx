import PhotovoltaicContractDurationForm from "./ContractDurationForm";

import {
  goToStep,
  ProjectCreationStep,
  setPhotovoltaicContractDuration,
} from "@/features/create-project/application/createProject.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

function PhotovoltaicContractDurationContainer() {
  const dispatch = useAppDispatch();
  return (
    <PhotovoltaicContractDurationForm
      onSubmit={(data) => {
        dispatch(setPhotovoltaicContractDuration(data.photovoltaicContractDuration));
        dispatch(goToStep(ProjectCreationStep.SOILS_SURFACE_AREAS));
      }}
    />
  );
}

export default PhotovoltaicContractDurationContainer;

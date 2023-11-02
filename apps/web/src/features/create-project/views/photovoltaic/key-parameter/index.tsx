import PhotovoltaicKeyParameterForm from "./KeyParameterForm";

import {
  goToStep,
  ProjectCreationStep,
  setPhotovoltaicKeyParameter,
} from "@/features/create-project/application/createProject.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

function PhotovoltaicKeyParameterContainer() {
  const dispatch = useAppDispatch();
  return (
    <PhotovoltaicKeyParameterForm
      onSubmit={(data) => {
        dispatch(setPhotovoltaicKeyParameter(data.photovoltaic.keyParameter));
        dispatch(goToStep(ProjectCreationStep.CREATION_CONFIRMATION));
      }}
    />
  );
}

export default PhotovoltaicKeyParameterContainer;

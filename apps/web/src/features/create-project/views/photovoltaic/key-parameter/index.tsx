import PhotovoltaicKeyParameterForm from "./KeyParameterForm";

import {
  goToStep,
  ProjectCreationStep,
  setPhotovoltaicKeyParameter,
} from "@/features/create-project/application/createProject.reducer";
import { PhotovoltaicKeyParameter } from "@/features/create-project/domain/project.types";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

function PhotovoltaicKeyParameterContainer() {
  const dispatch = useAppDispatch();
  return (
    <PhotovoltaicKeyParameterForm
      onSubmit={(data) => {
        const nextStep =
          data.photovoltaicKeyParameter === PhotovoltaicKeyParameter.POWER
            ? ProjectCreationStep.PHOTOVOLTAIC_POWER
            : ProjectCreationStep.PHOTOVOLTAIC_SURFACE;
        dispatch(setPhotovoltaicKeyParameter(data.photovoltaicKeyParameter));
        dispatch(goToStep(nextStep));
      }}
    />
  );
}

export default PhotovoltaicKeyParameterContainer;

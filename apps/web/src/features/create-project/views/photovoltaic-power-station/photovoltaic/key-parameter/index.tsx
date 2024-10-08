import PhotovoltaicKeyParameterForm from "./KeyParameterForm";

import {
  completePhotovoltaicKeyParameter,
  revertPhotovoltaicKeyParameter,
} from "@/features/create-project/application/createProject.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

function PhotovoltaicKeyParameterContainer() {
  const dispatch = useAppDispatch();
  return (
    <PhotovoltaicKeyParameterForm
      onSubmit={(data) => {
        dispatch(completePhotovoltaicKeyParameter(data.photovoltaicKeyParameter));
      }}
      onBack={() => dispatch(revertPhotovoltaicKeyParameter())}
    />
  );
}

export default PhotovoltaicKeyParameterContainer;

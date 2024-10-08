import {
  completePhotovoltaicKeyParameter,
  revertPhotovoltaicKeyParameter,
} from "@/features/create-project/application/createProject.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import PhotovoltaicKeyParameterForm from "./KeyParameterForm";

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

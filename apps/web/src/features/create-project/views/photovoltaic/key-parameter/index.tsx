import PhotovoltaicKeyParameterForm from "./KeyParameterForm";

import { completePhotovoltaicKeyParameter } from "@/features/create-project/application/createProject.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

function PhotovoltaicKeyParameterContainer() {
  const dispatch = useAppDispatch();
  return (
    <PhotovoltaicKeyParameterForm
      onSubmit={(data) => {
        dispatch(completePhotovoltaicKeyParameter(data.photovoltaicKeyParameter));
      }}
    />
  );
}

export default PhotovoltaicKeyParameterContainer;

import FricheSurfaceAreaForm from "./FricheSurfaceAreaForm";

import { setSurfaceArea } from "@/features/create-site/application/createFriche.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";
import { AppDispatch } from "@/store";

const mapProps = (dispatch: AppDispatch) => {
  return {
    onSubmit: (formData: { surfaceArea: number }) =>
      dispatch(setSurfaceArea(formData.surfaceArea)),
  };
};

function FricheSurfaceAreaFormContainer() {
  const dispatch = useAppDispatch();

  return <FricheSurfaceAreaForm {...mapProps(dispatch)} />;
}

export default FricheSurfaceAreaFormContainer;

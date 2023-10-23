import FricheSoilsForm, { FormValues } from "./FricheSoilsForm";

import { setSoils } from "@/features/create-site/application/createFriche.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";
import { AppDispatch } from "@/store";

const mapProps = (dispatch: AppDispatch) => {
  return {
    onSubmit: (formData: FormValues) => {
      dispatch(setSoils(formData.soils));
    },
  };
};

const FricheSoilsFormContainer = () => {
  const dispatch = useAppDispatch();

  return <FricheSoilsForm {...mapProps(dispatch)} />;
};

export default FricheSoilsFormContainer;

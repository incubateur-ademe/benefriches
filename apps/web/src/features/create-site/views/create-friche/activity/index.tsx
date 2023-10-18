import FricheActivityForm, { FormValues } from "./FricheActivityForm";

import { setActivity } from "@/features/create-site/application/createFriche.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";
import { AppDispatch } from "@/store";

const mapProps = (dispatch: AppDispatch) => {
  return {
    onSubmit: (formData: FormValues) => {
      dispatch(setActivity(formData.activity));
    },
  };
};

function FricheActivityFormContainer() {
  const dispatch = useAppDispatch();

  return <FricheActivityForm {...mapProps(dispatch)} />;
}

export default FricheActivityFormContainer;

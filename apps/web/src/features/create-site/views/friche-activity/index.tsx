import FricheActivityForm, { FormValues } from "./FricheActivityForm";

import { AppDispatch } from "@/app/application/store";
import { completeFricheActivity } from "@/features/create-site/application/createSite.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

const mapProps = (dispatch: AppDispatch) => {
  return {
    onSubmit: (formData: FormValues) => {
      dispatch(completeFricheActivity(formData.activity));
    },
  };
};

function FricheActivityFormContainer() {
  const dispatch = useAppDispatch();

  return <FricheActivityForm {...mapProps(dispatch)} />;
}

export default FricheActivityFormContainer;

import FricheActivityForm, { FormValues } from "./FricheActivityForm";

import {
  goToStep,
  setFricheActivity,
  SiteCreationStep,
} from "@/features/create-site/application/createSite.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";
import { AppDispatch } from "@/store";

const mapProps = (dispatch: AppDispatch) => {
  return {
    onSubmit: (formData: FormValues) => {
      dispatch(setFricheActivity(formData.activity));
      dispatch(goToStep(SiteCreationStep.NAMING));
    },
  };
};

function FricheActivityFormContainer() {
  const dispatch = useAppDispatch();

  return <FricheActivityForm {...mapProps(dispatch)} />;
}

export default FricheActivityFormContainer;

import SiteNameAndDescriptionForm, {
  FormValues,
} from "./SiteNameAndDescription";

import {
  goToStep,
  setNameAndDescription,
  SiteCreationStep,
} from "@/features/create-site/application/createSite.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";
import { AppDispatch } from "@/store";

const mapProps = (dispatch: AppDispatch) => {
  return {
    onSubmit: (formData: FormValues) => {
      dispatch(setNameAndDescription(formData));
      dispatch(goToStep(SiteCreationStep.CREATION_CONFIRMATION));
    },
  };
};

function SiteNameAndDescriptionFormContainer() {
  const dispatch = useAppDispatch();

  return <SiteNameAndDescriptionForm {...mapProps(dispatch)} />;
}

export default SiteNameAndDescriptionFormContainer;

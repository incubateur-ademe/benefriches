import SiteNameAndDescriptionForm, {
  FormValues,
} from "./SiteNameAndDescription";

import { setNameAndDescription } from "@/features/create-site/application/createSite.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";
import { AppDispatch } from "@/store";

const mapProps = (dispatch: AppDispatch) => {
  return {
    onSubmit: (formData: FormValues) =>
      dispatch(setNameAndDescription(formData)),
  };
};

function SiteNameAndDescriptionFormContainer() {
  const dispatch = useAppDispatch();

  return <SiteNameAndDescriptionForm {...mapProps(dispatch)} />;
}

export default SiteNameAndDescriptionFormContainer;

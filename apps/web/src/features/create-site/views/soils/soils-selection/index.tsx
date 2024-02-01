import { goToStep, setSoils, SiteCreationStep } from "../../../application/createSite.reducer";
import SiteSoilsForm, { FormValues } from "./SoilsForm";

import { AppDispatch, RootState } from "@/app/application/store";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

const mapProps = (dispatch: AppDispatch, siteCreationState: RootState["siteCreation"]) => {
  return {
    isFriche: !!siteCreationState.siteData.isFriche,
    onSubmit: (formData: FormValues) => {
      dispatch(setSoils(formData.soils));
      dispatch(goToStep(SiteCreationStep.SOILS_SURFACE_AREAS_ACCURACY_SELECTION));
    },
  };
};

const SiteSoilsFormContainer = () => {
  const dispatch = useAppDispatch();
  const siteCreationState = useAppSelector((state) => state.siteCreation);

  return <SiteSoilsForm {...mapProps(dispatch, siteCreationState)} />;
};

export default SiteSoilsFormContainer;

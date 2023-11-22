import SoilContaminationForm from "./SoilContaminationForm";

import {
  goToStep,
  setContaminatedSoilSurface,
  SiteCreationStep,
} from "@/features/create-site/application/createSite.reducer";
import {
  useAppDispatch,
  useAppSelector,
} from "@/shared/views/hooks/store.hooks";
import { AppDispatch, RootState } from "@/store";

const mapProps = (
  dispatch: AppDispatch,
  siteData: RootState["siteCreation"]["siteData"],
) => {
  return {
    surfaceArea: siteData.surfaceArea ?? 0,
    onSubmit: (data: { contaminatedSurface: number }) => {
      const nextStep = siteData.isFriche
        ? SiteCreationStep.FRICHE_ACTIVITY
        : SiteCreationStep.NAMING;
      dispatch(setContaminatedSoilSurface(data.contaminatedSurface ?? 0));
      dispatch(goToStep(nextStep));
    },
  };
};

function SoilContaminationFormController() {
  const dispatch = useAppDispatch();
  const siteData = useAppSelector((state) => state.siteCreation.siteData);

  return <SoilContaminationForm {...mapProps(dispatch, siteData)} />;
}

export default SoilContaminationFormController;

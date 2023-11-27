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
import { AppDispatch } from "@/store";

const mapProps = (dispatch: AppDispatch, surfaceArea: number) => {
  return {
    surfaceArea,
    onSubmit: (data: { contaminatedSurface: number }) => {
      dispatch(setContaminatedSoilSurface(data.contaminatedSurface ?? 0));
      dispatch(goToStep(SiteCreationStep.MANAGEMENT_INTRODUCTION));
    },
  };
};

function SoilContaminationFormController() {
  const dispatch = useAppDispatch();
  const surfaceArea = useAppSelector(
    (state) => state.siteCreation.siteData.surfaceArea ?? 0,
  );

  return <SoilContaminationForm {...mapProps(dispatch, surfaceArea)} />;
}

export default SoilContaminationFormController;

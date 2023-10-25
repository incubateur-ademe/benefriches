import SoilContaminationForm from "./SoilContaminationForm";

import {
  goToStep,
  setContaminatedSoilSurface,
  SiteCreationStep,
} from "@/features/create-site/application/createSite.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";
import { AppDispatch } from "@/store";

const mapProps = (dispatch: AppDispatch) => {
  return {
    onSubmit: (data: { contaminatedSurface: number }) => {
      dispatch(setContaminatedSoilSurface(data.contaminatedSurface ?? 0));
      dispatch(goToStep(SiteCreationStep.MANAGEMENT_INTRODUCTION));
    },
  };
};

function SoilContaminationFormController() {
  const dispatch = useAppDispatch();

  return <SoilContaminationForm {...mapProps(dispatch)} />;
}

export default SoilContaminationFormController;

import SoilContaminationForm, { FormValues } from "./SoilContaminationForm";

import { AppDispatch } from "@/app/application/store";
import {
  goToStep,
  setContaminatedSoils,
  SiteCreationStep,
} from "@/features/create-site/application/createSite.reducer";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

const mapProps = (dispatch: AppDispatch, siteSurfaceArea: number) => {
  return {
    siteSurfaceArea,
    onSubmit: ({ hasContaminatedSoils, contaminatedSurface }: FormValues) => {
      dispatch(
        setContaminatedSoils({
          hasContaminatedSoils: hasContaminatedSoils === "yes",
          contaminatedSoilSurface: contaminatedSurface,
        }),
      );
      dispatch(goToStep(SiteCreationStep.FRICHE_ACTIVITY));
    },
  };
};

function SoilContaminationFormController() {
  const dispatch = useAppDispatch();
  const siteSurfaceArea = useAppSelector((state) => state.siteCreation.siteData.surfaceArea ?? 0);

  return <SoilContaminationForm {...mapProps(dispatch, siteSurfaceArea)} />;
}

export default SoilContaminationFormController;

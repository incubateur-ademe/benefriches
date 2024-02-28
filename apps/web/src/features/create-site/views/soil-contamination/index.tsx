import SoilContaminationForm, { FormValues } from "./SoilContaminationForm";

import { AppDispatch } from "@/app/application/store";
import { completeSoilsContamination } from "@/features/create-site/application/createSite.reducer";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

const mapProps = (dispatch: AppDispatch, siteSurfaceArea: number) => {
  return {
    siteSurfaceArea,
    onSubmit: ({ hasContaminatedSoils, contaminatedSurface }: FormValues) => {
      dispatch(
        completeSoilsContamination({
          hasContaminatedSoils: hasContaminatedSoils === "yes",
          contaminatedSoilSurface: contaminatedSurface,
        }),
      );
    },
  };
};

function SoilContaminationFormController() {
  const dispatch = useAppDispatch();
  const siteSurfaceArea = useAppSelector((state) => state.siteCreation.siteData.surfaceArea ?? 0);

  return <SoilContaminationForm {...mapProps(dispatch, siteSurfaceArea)} />;
}

export default SoilContaminationFormController;

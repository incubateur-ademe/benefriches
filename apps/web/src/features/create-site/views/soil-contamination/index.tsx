import SoilContaminationForm, { FormValues } from "./SoilContaminationForm";

import {
  goToStep,
  setContaminatedSoils,
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
    onSubmit: ({ hasContaminatedSoils, contaminatedSurface }: FormValues) => {
      dispatch(
        setContaminatedSoils({
          hasContaminatedSoils: hasContaminatedSoils === "yes",
          contaminatedSoilSurface: contaminatedSurface,
        }),
      );
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

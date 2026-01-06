import { stepReverted } from "@/features/create-site/core/actions/revert.action";
import { soilsContaminationStepCompleted } from "@/features/create-site/core/actions/soilsContaminationAndAccidents.actions";
import {
  selectSiteSoilsContamination,
  selectSiteSurfaceArea,
} from "@/features/create-site/core/selectors/createSite.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import SoilContaminationForm, { FormValues } from "./SoilContaminationForm";

const mapInitialValues = (siteContamination: {
  hasContaminatedSoils: boolean | undefined;
  contaminatedSoilSurface: number | undefined;
}): FormValues => {
  return {
    hasContaminatedSoils: (() => {
      switch (siteContamination.hasContaminatedSoils) {
        case true:
          return "yes";
        case false:
          return "no";
        default:
          return null;
      }
    })(),
    contaminatedSurface: siteContamination.contaminatedSoilSurface ?? 0,
  };
};

function SoilContaminationFormController() {
  const dispatch = useAppDispatch();
  const siteSurfaceArea = useAppSelector(selectSiteSurfaceArea);
  const siteContamination = useAppSelector(selectSiteSoilsContamination);

  return (
    <SoilContaminationForm
      initialValues={mapInitialValues(siteContamination)}
      siteSurfaceArea={siteSurfaceArea ?? 0}
      onSubmit={({ hasContaminatedSoils, contaminatedSurface }: FormValues) => {
        dispatch(
          soilsContaminationStepCompleted({
            hasContaminatedSoils: hasContaminatedSoils === "yes",
            contaminatedSoilSurface: contaminatedSurface,
          }),
        );
      }}
      onBack={() => {
        dispatch(stepReverted());
      }}
    />
  );
}

export default SoilContaminationFormController;

import { stepReverted } from "@/features/create-site/core/actions/revert.action";
import { soilsContaminationStepCompleted } from "@/features/create-site/core/steps/contamination-and-accidents/contaminationAndAccidents.actions";
import { selectSoilContaminationFormViewData } from "@/features/create-site/core/steps/contamination-and-accidents/contaminationAndAccidents.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import SoilContaminationForm, { type FormValues } from "./SoilContaminationForm";

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
  const { siteSurfaceArea, siteContamination } = useAppSelector(
    selectSoilContaminationFormViewData,
  );

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

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-site/core/custom/custom.actions";
import { selectSoilContaminationFormViewData } from "@/features/create-site/core/steps/contamination-and-accidents/contaminationAndAccidents.selectors";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";

import SoilContaminationForm from "./SoilContaminationForm";

function SoilContaminationFormController() {
  const dispatch = useAppDispatch();
  const { siteSurfaceArea, siteContamination } = useAppSelector(
    selectSoilContaminationFormViewData,
  );

  return (
    <SoilContaminationForm
      title="Les sols de la friche sont-ils pollués ?"
      instructions={
        <FormInfo>
          <span className="title">Quid de l’amiante&nbsp;?</span>

          <p>
            La présence d’amiante des bâtiments n'est pas à considérer ici, mais un poste de dépense
            "désamiantage" pourra être alloué dans la partie “création d'un projet sur la friche”
          </p>
        </FormInfo>
      }
      initialValues={siteContamination}
      siteSurfaceArea={siteSurfaceArea ?? 0}
      onSubmit={({ hasContaminatedSoils, contaminatedSoilSurface }) => {
        dispatch(
          stepCompletionRequested({
            stepId: "SOILS_CONTAMINATION",
            answers: { hasContaminatedSoils, contaminatedSoilSurface },
          }),
        );
      }}
      onBack={() => {
        dispatch(previousStepRequested());
      }}
    />
  );
}

export default SoilContaminationFormController;

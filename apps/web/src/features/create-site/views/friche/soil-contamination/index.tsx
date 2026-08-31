import { useAppSelector } from "@/app/hooks/store.hooks";
import { useCustomSiteForm } from "@/features/create-site/views/site-form/useCustomSiteForm";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";

import SoilContaminationForm from "./SoilContaminationForm";

function SoilContaminationFormController() {
  const { onBack, onRequestStepCompletion, selectSoilContaminationFormViewData } =
    useCustomSiteForm();
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
        onRequestStepCompletion({
          stepId: "SOILS_CONTAMINATION",
          answers: { hasContaminatedSoils, contaminatedSoilSurface },
        });
      }}
      onBack={() => {
        onBack();
      }}
    />
  );
}

export default SoilContaminationFormController;

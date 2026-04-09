import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { stepReverted } from "@/features/create-site/core/actions/revert.action";
import { soilsContaminationStepCompleted } from "@/features/create-site/core/steps/contamination-and-accidents/contaminationAndAccidents.actions";
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
          Quid de l’amiante&nbsp;?
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
          soilsContaminationStepCompleted({ hasContaminatedSoils, contaminatedSoilSurface }),
        );
      }}
      onBack={() => {
        dispatch(stepReverted());
      }}
    />
  );
}

export default SoilContaminationFormController;

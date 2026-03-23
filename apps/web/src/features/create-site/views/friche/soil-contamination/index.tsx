import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { stepReverted } from "@/features/create-site/core/actions/revert.action";
import { soilsContaminationStepCompleted } from "@/features/create-site/core/steps/contamination-and-accidents/contaminationAndAccidents.actions";
import { selectSoilContaminationFormViewData } from "@/features/create-site/core/steps/contamination-and-accidents/contaminationAndAccidents.selectors";
import FormDefinition from "@/shared/views/layout/WizardFormLayout/FormDefinition";

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
        <FormDefinition hideDivider>
          <p>
            Les activités antérieures exercées sur le site, qu'elles soient industrielles (fonderie,
            textiles, travail des métaux, etc.), de service (stations-services…), ferroviaire, etc.
            ont pu être à l'origine de pollution des sols.
          </p>
          <p>
            Donner un nouvel usage à un site présentant des pollutions (ex : hydrocarbures,
            solvants, métaux lourds) nécessitera vraisemblablement des mesures de gestion pour
            abaisser les niveaux de contamination et assurer la maîtrise des éventuels risques
            sanitaires.
          </p>
          <p>
            La pollution à l'amiante des bâtiments n'est pas à considérer ici, mais un poste de
            dépense "désamiantage" pourra être alloué, le cas échéant, dans la partie "création d'un
            projet sur la friche".
          </p>
        </FormDefinition>
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

import { selectProjectId } from "@/features/create-project/core/createProject.selectors";
import { navigateToStep } from "@/features/create-project/core/urban-project-beta/urbanProject.actions";
import {
  selectFormAnswers,
  selectIsFormStatusValid,
  selectProjectSoilDistribution,
  selectProjectSpaces,
} from "@/features/create-project/core/urban-project-beta/urbanProject.selectors";
import { customUrbanProjectSaved } from "@/features/create-project/core/urban-project-beta/urbanProjectCustomSaved.action";
import { UrbanProjectCreationStep } from "@/features/create-project/core/urban-project-beta/urbanProjectSteps";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { useInformationalStepBackNext } from "../useInformationalStepBackNext";
import ProjectCreationDataSummary from "./ProjectCreationDataSummary";

function ProjectionCreationDataSummaryContainer() {
  const { onNext, onBack } = useInformationalStepBackNext();
  const projectData = useAppSelector(selectFormAnswers);
  const projectSoilsDistribution = useAppSelector(selectProjectSoilDistribution);
  const projectSpaces = useAppSelector(selectProjectSpaces);
  const projectId = useAppSelector(selectProjectId);
  const dispatch = useAppDispatch();
  const isFormValid = useAppSelector(selectIsFormStatusValid);

  return (
    <ProjectCreationDataSummary
      nextDisabled={!isFormValid}
      instructions={
        !isFormValid ? (
          <>
            <div className="text-3xl py-2">⚠️</div>
            <strong className="*:mb-4">
              Le formulaire n'est pas complet ! <br />
              Pour valider votre projet, veuillez remplir les étapes manquantes en naviguant via
              l'étapier.
            </strong>
          </>
        ) : undefined
      }
      onNext={() => {
        void dispatch(customUrbanProjectSaved());
        onNext();
      }}
      onBack={onBack}
      projectData={projectData}
      projectSoilsDistribution={projectSoilsDistribution}
      projectId={projectId}
      projectSpaces={projectSpaces}
      getSectionButtonProps={(stepId: UrbanProjectCreationStep) => {
        return {
          iconId: "fr-icon-pencil-line",
          children: "Modifier",
          onClick: () => {
            dispatch(navigateToStep({ stepId }));
          },
        };
      }}
    />
  );
}

export default ProjectionCreationDataSummaryContainer;

import { useAppSelector } from "@/app/hooks/store.hooks";
import { RootState } from "@/app/store/store";
import { selectShouldGoThroughOnboarding } from "@/features/projects/application/project-impacts/impactsOnboardingSkip.selectors";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

import ProjectCreationResult from "../../../common-views/result/ProjectCreationResult";

function ProjectCreationResultContainer() {
  const { onBack, selectStepAnswers } = useProjectForm();

  const { saveState, projectId } = useAppSelector((state: RootState) => ({
    saveState: state.projectCreation.urbanProject.saveState,
    projectId: state.projectCreation.projectId,
  }));
  const projectName = useAppSelector(selectStepAnswers("URBAN_PROJECT_NAMING"))?.name;
  const shouldGoThroughOnboarding = useAppSelector(selectShouldGoThroughOnboarding);

  return (
    <ProjectCreationResult
      projectId={projectId}
      projectName={projectName ?? ""}
      loadingState={saveState}
      onBack={onBack}
      shouldGoThroughOnboarding={shouldGoThroughOnboarding}
    />
  );
}

export default ProjectCreationResultContainer;

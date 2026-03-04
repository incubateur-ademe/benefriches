import { useAppSelector } from "@/app/hooks/store.hooks";
import { selectCustomCreationResultViewData } from "@/features/create-project/core/createProject.selectors";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

import ProjectCreationResult from "../../../common-views/result/ProjectCreationResult";

function ProjectCreationResultContainer() {
  const { onBack } = useProjectForm();

  const { projectId, projectName, saveState, shouldGoThroughOnboarding } = useAppSelector(
    selectCustomCreationResultViewData,
  );

  return (
    <ProjectCreationResult
      projectId={projectId}
      projectName={projectName}
      loadingState={saveState}
      onBack={onBack}
      shouldGoThroughOnboarding={shouldGoThroughOnboarding}
    />
  );
}

export default ProjectCreationResultContainer;

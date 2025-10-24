import { RootState } from "@/shared/core/store-config/store";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

import ProjectCreationResult from "../../../common-views/result/ProjectCreationResult";

function ProjectCreationResultContainer() {
  const { onBack, selectStepAnswers } = useProjectForm();

  const { saveState, projectId } = useAppSelector((state: RootState) => ({
    saveState: state.projectCreation.urbanProject.saveState,
    projectId: state.projectCreation.projectId,
  }));
  const projectName = useAppSelector(selectStepAnswers("URBAN_PROJECT_NAMING"))?.name;

  return (
    <ProjectCreationResult
      projectId={projectId}
      projectName={projectName ?? ""}
      loadingState={saveState}
      onBack={onBack}
    />
  );
}

export default ProjectCreationResultContainer;

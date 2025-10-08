import { selectStepAnswers } from "@/features/create-project/core/urban-project/urbanProject.selectors";
import { RootState } from "@/shared/core/store-config/store";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";

import ProjectCreationResult from "../../../common-views/result/ProjectCreationResult";
import { useInformationalStepBackNext } from "../useInformationalStepBackNext";

function ProjectCreationResultContainer() {
  const { saveState, projectId } = useAppSelector((state: RootState) => ({
    saveState: state.projectCreation.urbanProject.saveState,
    projectId: state.projectCreation.projectId,
  }));
  const { name: projectName } = useAppSelector(selectStepAnswers("URBAN_PROJECT_NAMING")) ?? {};
  const { onBack } = useInformationalStepBackNext();

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

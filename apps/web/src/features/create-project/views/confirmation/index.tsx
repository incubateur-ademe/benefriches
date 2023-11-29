import ProjectCreationConfirmation from "./ProjectCreationConfirmation";

import { useAppSelector } from "@/shared/views/hooks/store.hooks";

function ProjectCreationConfirmationContainer() {
  const { projectData, saveProjectLoadingState } = useAppSelector(
    (state) => state.projectCreation,
  );

  return (
    <ProjectCreationConfirmation
      projectId={projectData.id ?? ""}
      projectName={projectData.name ?? ""}
      loadingState={saveProjectLoadingState}
    />
  );
}

export default ProjectCreationConfirmationContainer;

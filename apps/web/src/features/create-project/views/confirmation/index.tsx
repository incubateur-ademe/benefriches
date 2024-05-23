import ProjectCreationConfirmation from "./ProjectCreationConfirmation";

import { useAppSelector } from "@/shared/views/hooks/store.hooks";

function ProjectCreationConfirmationContainer() {
  const { projectData, saveProjectLoadingState, siteData } = useAppSelector(
    (state) => state.projectCreation,
  );

  return (
    <ProjectCreationConfirmation
      projectId={projectData.id ?? ""}
      projectName={projectData.name ?? ""}
      siteName={siteData?.name ?? ""}
      loadingState={saveProjectLoadingState}
    />
  );
}

export default ProjectCreationConfirmationContainer;

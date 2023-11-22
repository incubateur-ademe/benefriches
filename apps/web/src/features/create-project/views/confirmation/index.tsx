import ProjectCreationConfirmation from "./ProjectCreationConfirmation";

import { useAppSelector } from "@/shared/views/hooks/store.hooks";

function ProjectCreationConfirmationContainer() {
  const { projectData, siteData, saveProjectLoadingState } = useAppSelector(
    (state) => state.projectCreation,
  );

  return (
    <ProjectCreationConfirmation
      projectName={projectData.name ?? ""}
      siteName={siteData?.name ?? ""}
      loadingState={saveProjectLoadingState}
    />
  );
}

export default ProjectCreationConfirmationContainer;

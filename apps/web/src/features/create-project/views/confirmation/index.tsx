import ProjectCreationConfirmation from "./ProjectCreationConfirmation";

import { useAppSelector } from "@/shared/views/hooks/store.hooks";

function ProjectCreationConfirmationContainer() {
  const { projectData, siteData } = useAppSelector(
    (state) => state.projectCreation,
  );
  return (
    <ProjectCreationConfirmation
      projectName={projectData.name ?? ""}
      siteName={siteData?.name ?? ""}
    />
  );
}

export default ProjectCreationConfirmationContainer;

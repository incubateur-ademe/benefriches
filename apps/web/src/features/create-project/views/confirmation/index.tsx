import ProjectCreationConfirmation from "./ProjectCreationConfirmation";

import { useAppSelector } from "@/shared/views/hooks/store.hooks";

function ProjectCreationConfirmationContainer() {
  const { projectData } = useAppSelector((state) => state.projectCreation);
  return (
    <ProjectCreationConfirmation
      projectName=""
      siteName={projectData.relatedSite?.name ?? ""}
    />
  );
}

export default ProjectCreationConfirmationContainer;

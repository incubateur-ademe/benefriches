import ProjectCreationConfirmation from "./ProjectCreationConfirmation";

import { useAppSelector } from "@/shared/views/hooks/store.hooks";

function ProjectCreationConfirmationContainer() {
  const relatedSite = useAppSelector(
    (state) => state.projectCreation.projectData.relatedSite,
  );
  return (
    <ProjectCreationConfirmation
      projectName=""
      siteName={relatedSite?.name ?? ""}
    />
  );
}

export default ProjectCreationConfirmationContainer;

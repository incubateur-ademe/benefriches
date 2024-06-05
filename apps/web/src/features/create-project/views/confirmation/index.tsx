import { useDispatch } from "react-redux";
import { revertConfirmationStep } from "../../application/createProject.reducer";
import ProjectCreationConfirmation from "./ProjectCreationConfirmation";

import { useAppSelector } from "@/shared/views/hooks/store.hooks";

function ProjectCreationConfirmationContainer() {
  const { projectData, saveProjectLoadingState, siteData } = useAppSelector(
    (state) => state.projectCreation,
  );

  const dispatch = useDispatch();

  const onBack = () => {
    dispatch(revertConfirmationStep());
  };

  return (
    <ProjectCreationConfirmation
      projectId={projectData.id ?? ""}
      projectName={projectData.name ?? ""}
      siteName={siteData?.name ?? ""}
      loadingState={saveProjectLoadingState}
      onBack={onBack}
    />
  );
}

export default ProjectCreationConfirmationContainer;

import { useDispatch } from "react-redux";

import { useAppSelector } from "@/shared/views/hooks/store.hooks";

import { revertResultStep } from "../../../application/createProject.reducer";
import ProjectCreationResult from "./ProjectCreationResult";

function ProjectCreationResultContainer() {
  const { projectData, saveProjectLoadingState, siteData } = useAppSelector(
    (state) => state.projectCreation,
  );

  const dispatch = useDispatch();

  const onBack = () => {
    dispatch(revertResultStep());
  };

  return (
    <ProjectCreationResult
      projectId={projectData.id ?? ""}
      projectName={projectData.name ?? ""}
      siteName={siteData?.name ?? ""}
      loadingState={saveProjectLoadingState}
      onBack={onBack}
    />
  );
}

export default ProjectCreationResultContainer;

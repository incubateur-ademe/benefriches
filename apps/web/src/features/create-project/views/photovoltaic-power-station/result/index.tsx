import { useDispatch } from "react-redux";

import { selectSiteData } from "@/features/create-project/application/createProject.selectors";
import { revertResultStep } from "@/features/create-project/application/renewable-energy/renewableEnergy.actions";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";

import ProjectCreationResult from "./ProjectCreationResult";

function ProjectCreationResultContainer() {
  const { creationData, saveState } = useAppSelector(
    (state) => state.projectCreation.renewableEnergyProject,
  );
  const projectId = useAppSelector((state) => state.projectCreation.projectId);
  const siteData = useAppSelector(selectSiteData);

  const dispatch = useDispatch();

  const onBack = () => {
    dispatch(revertResultStep());
  };

  return (
    <ProjectCreationResult
      projectId={projectId}
      projectName={creationData.name ?? ""}
      siteName={siteData?.name ?? ""}
      loadingState={saveState}
      onBack={onBack}
    />
  );
}

export default ProjectCreationResultContainer;

import { selectProjectId } from "@/features/create-project/application/createProject.selectors";
import { saveReconversionProject } from "@/features/create-project/application/urban-project/saveReconversionProject.action";
import { finalSummaryReverted } from "@/features/create-project/application/urban-project/urbanProject.actions";
import {
  getUrbanProjectSpaceDistribution,
  selectCreationData,
  selectUrbanProjectSoilsDistribution,
} from "@/features/create-project/application/urban-project/urbanProject.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import ProjectCreationDataSummary from "./ProjectCreationDataSummary";

function ProjectionCreationDataSummaryContainer() {
  const projectData = useAppSelector(selectCreationData);
  const projectId = useAppSelector(selectProjectId);

  const projectSoilsDistribution = useAppSelector(selectUrbanProjectSoilsDistribution);
  const spaceDistribution = useAppSelector(getUrbanProjectSpaceDistribution);

  const dispatch = useAppDispatch();

  const onNext = () => {
    void dispatch(saveReconversionProject());
  };

  const onBack = () => {
    dispatch(finalSummaryReverted());
  };

  return (
    <ProjectCreationDataSummary
      onNext={onNext}
      onBack={onBack}
      projectId={projectId}
      projectData={projectData}
      projectSoilsDistribution={projectSoilsDistribution}
      projectSpaces={spaceDistribution}
    />
  );
}

export default ProjectionCreationDataSummaryContainer;
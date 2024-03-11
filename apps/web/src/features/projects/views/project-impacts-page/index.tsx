import { useEffect } from "react";
import { fetchReconversionProjectImpacts } from "../../application/fetchReconversionProjectImpacts.action";
import ProjectImpactsPageWrapper from "./ProjectImpactsPageWrapper";

import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

type Props = {
  projectId: string;
};

function ProjectsImpacts({ projectId }: Props) {
  const dispatch = useAppDispatch();

  const { projectData, impactsData, dataLoadingState } = useAppSelector(
    (state) => state.projectImpacts,
  );

  useEffect(() => {
    void dispatch(fetchReconversionProjectImpacts(projectId));
  }, [projectId, dispatch]);

  return (
    <ProjectImpactsPageWrapper
      projectData={projectData}
      impactsData={impactsData}
      dataLoadingState={dataLoadingState}
    />
  );
}

export default ProjectsImpacts;

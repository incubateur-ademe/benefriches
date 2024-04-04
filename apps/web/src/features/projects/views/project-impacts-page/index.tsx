import { useEffect } from "react";
import { fetchReconversionProjectImpacts } from "../../application/fetchReconversionProjectImpacts.action";
import { setEvaluationPeriod } from "../../application/projectImpacts.reducer";
import ProjectImpactsPageWrapper from "./ProjectImpactsPageWrapper";

import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

type Props = {
  projectId: string;
};

function ProjectsImpacts({ projectId }: Props) {
  const dispatch = useAppDispatch();

  const { projectData, relatedSiteData, impactsData, dataLoadingState, evaluationPeriod } =
    useAppSelector((state) => state.projectImpacts);

  useEffect(() => {
    void dispatch(fetchReconversionProjectImpacts({ projectId, evaluationPeriod }));
  }, [projectId, evaluationPeriod, dispatch]);

  return (
    <ProjectImpactsPageWrapper
      projectData={projectData}
      relatedSiteData={relatedSiteData}
      impactsData={impactsData}
      dataLoadingState={dataLoadingState}
      evaluationPeriod={evaluationPeriod}
      onEvaluationPeriodChange={(evaluationPeriod: number) =>
        dispatch(setEvaluationPeriod(evaluationPeriod))
      }
    />
  );
}

export default ProjectsImpacts;

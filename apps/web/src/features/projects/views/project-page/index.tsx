import { useEffect } from "react";

import { loadFeatureAlerts } from "@/features/user-feature-alerts/core/loadFeatureAlerts.action";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { fetchImpactsForReconversionProject } from "../../application/project-impacts/fetchImpactsForReconversionProject.action";
import {
  selectProjectContext,
  setEvaluationPeriod,
  setViewMode,
  ViewMode,
} from "../../application/project-impacts/projectImpacts.reducer";
import ProjectPage from "./ProjectImpactsPage";

type Props = {
  projectId: string;
};

function ProjectPageContainer({ projectId }: Props) {
  const dispatch = useAppDispatch();

  const { dataLoadingState, evaluationPeriod, currentViewMode } = useAppSelector(
    (state) => state.projectImpacts,
  );

  const projectContext = useAppSelector(selectProjectContext);

  useEffect(() => {
    void dispatch(fetchImpactsForReconversionProject({ projectId, evaluationPeriod }));
  }, [projectId, evaluationPeriod, dispatch]);

  useEffect(() => {
    void dispatch(loadFeatureAlerts());
  }, [dispatch]);

  return (
    <ProjectPage
      projectId={projectId}
      projectContext={projectContext}
      dataLoadingState={dataLoadingState}
      evaluationPeriod={evaluationPeriod}
      currentViewMode={currentViewMode}
      onEvaluationPeriodChange={(evaluationPeriod: number) =>
        dispatch(setEvaluationPeriod(evaluationPeriod))
      }
      onCurrentViewModeChange={(viewMode: ViewMode) => dispatch(setViewMode(viewMode))}
    />
  );
}

export default ProjectPageContainer;

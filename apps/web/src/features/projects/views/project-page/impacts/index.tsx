import { useEffect } from "react";

import { loadFeatureAlerts } from "@/features/user-feature-alerts/core/loadFeatureAlerts.action";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { viewModeUpdated } from "../../../application/project-impacts/actions";
import { evaluationPeriodUpdated } from "../../../application/project-impacts/actions";
import {
  selectProjectsImpactsViewData,
  ViewMode,
} from "../../../application/project-impacts/projectImpacts.reducer";
import ProjectImpactsView from "./ProjectImpactsView";

type Props = {
  projectId: string;
};

function ProjectPageContainer({ projectId }: Props) {
  const dispatch = useAppDispatch();

  const { dataLoadingState, evaluationPeriod, currentViewMode } = useAppSelector(
    (state) => state.projectImpacts,
  );

  const { displayImpactsAccuracyDisclaimer, ...projectContext } = useAppSelector(
    selectProjectsImpactsViewData,
  );

  useEffect(() => {
    void dispatch(loadFeatureAlerts());
  }, [dispatch]);

  return (
    <ProjectImpactsView
      projectId={projectId}
      projectName={projectContext.name}
      projectContext={projectContext}
      dataLoadingState={dataLoadingState}
      evaluationPeriod={evaluationPeriod}
      currentViewMode={currentViewMode}
      displayImpactsAccuracyDisclaimer={displayImpactsAccuracyDisclaimer}
      onEvaluationPeriodChange={(evaluationPeriodInYears: number) =>
        dispatch(evaluationPeriodUpdated({ evaluationPeriodInYears }))
      }
      onCurrentViewModeChange={(viewMode: ViewMode) => dispatch(viewModeUpdated(viewMode))}
    />
  );
}

export default ProjectPageContainer;

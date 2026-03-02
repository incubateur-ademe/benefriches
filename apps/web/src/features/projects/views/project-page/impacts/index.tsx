import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { impactsExportModalOpened } from "@/features/analytics/core/analyticsEvents";
import { eventTracked } from "@/features/analytics/core/eventTracked.action";
import { selectImpactsPageViewData } from "@/features/projects/core/projectImpacts.selectors";
import { loadFeatureAlerts } from "@/features/user-feature-alerts/core/loadFeatureAlerts.action";

import {
  evaluationPeriodUpdated,
  viewModeUpdated,
} from "../../../application/project-impacts/actions";
import type { ViewMode } from "../../../application/project-impacts/projectImpacts.reducer";
import ProjectImpactsView from "./ProjectImpactsView";

type Props = {
  projectId: string;
};

function ProjectPageContainer({ projectId }: Props) {
  const dispatch = useAppDispatch();

  const {
    dataLoadingState,
    evaluationPeriod,
    currentViewMode,
    projectName,
    displayImpactsAccuracyDisclaimer,
    ...projectContext
  } = useAppSelector(selectImpactsPageViewData);

  useEffect(() => {
    void dispatch(loadFeatureAlerts());
  }, [dispatch]);

  return (
    <ProjectImpactsView
      projectId={projectId}
      projectName={projectName}
      projectContext={{ name: projectName, ...projectContext }}
      dataLoadingState={dataLoadingState}
      evaluationPeriod={evaluationPeriod}
      currentViewMode={currentViewMode}
      displayImpactsAccuracyDisclaimer={displayImpactsAccuracyDisclaimer}
      onEvaluationPeriodChange={(evaluationPeriodInYears: number) =>
        dispatch(evaluationPeriodUpdated({ evaluationPeriodInYears }))
      }
      onCurrentViewModeChange={(viewMode: ViewMode) => dispatch(viewModeUpdated(viewMode))}
      onExportModalOpened={() => void dispatch(eventTracked(impactsExportModalOpened()))}
    />
  );
}

export default ProjectPageContainer;

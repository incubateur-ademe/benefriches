import { useEffect } from "react";

import { selectImpactsPageViewData } from "@/features/projects/core/projectImpacts.selectors";
import { loadFeatureAlerts } from "@/features/user-feature-alerts/core/loadFeatureAlerts.action";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

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
    />
  );
}

export default ProjectPageContainer;

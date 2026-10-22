import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { impactsExportModalOpened } from "@/features/analytics/core/analyticsEvents";
import { eventTracked } from "@/features/analytics/core/eventTracked.action";
import { selectImpactsPageViewData } from "@/features/projects/application/project-impacts/selectors/projectImpacts.selectors";
import { loadFeatureAlerts } from "@/features/user-feature-alerts/core/loadFeatureAlerts.action";

import { evaluationPeriodUpdated } from "../../application/project-impacts/actions";
import ProjectImpactsView from "./ProjectImpactsView";

type Props = {
  projectId: string;
};

function ProjectPageContainer({ projectId }: Props) {
  const dispatch = useAppDispatch();

  const {
    dataLoadingState,
    evaluationPeriod,
    displayImpactsAccuracyDisclaimer,
    contextData,
    modalsData,
  } = useAppSelector(selectImpactsPageViewData);

  useEffect(() => {
    void dispatch(loadFeatureAlerts());
  }, [dispatch]);

  return (
    <ProjectImpactsView
      projectId={projectId}
      contextData={contextData}
      modalsData={modalsData}
      dataLoadingState={dataLoadingState}
      evaluationPeriod={evaluationPeriod}
      displayImpactsAccuracyDisclaimer={displayImpactsAccuracyDisclaimer}
      onEvaluationPeriodChange={(evaluationPeriodInYears: number) =>
        dispatch(evaluationPeriodUpdated(evaluationPeriodInYears))
      }
      onExportModalOpened={() => void dispatch(eventTracked(impactsExportModalOpened()))}
    />
  );
}

export default ProjectPageContainer;

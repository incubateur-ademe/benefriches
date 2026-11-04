import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { impactsExportModalOpened } from "@/features/analytics/core/analyticsEvents";
import { eventTracked } from "@/features/analytics/core/eventTracked.action";
import {
  selectImpactsDescriptionModalsDataView,
  selectImpactsPageViewData,
} from "@/features/projects/application/project-impacts/selectors/projectImpacts.selectors";

import { evaluationPeriodUpdated } from "../../application/project-impacts/actions";
import ProjectImpactsView from "./ProjectImpactsView";

type Props = {
  projectId: string;
};

function ProjectPageContainer({ projectId }: Props) {
  const dispatch = useAppDispatch();

  const { evaluationPeriod, displayImpactsAccuracyDisclaimer, dataLoadingState } =
    useAppSelector(selectImpactsPageViewData);

  const modalsData = useAppSelector(selectImpactsDescriptionModalsDataView);

  return (
    <ProjectImpactsView
      projectId={projectId}
      evaluationPeriod={evaluationPeriod}
      dataLoadingState={dataLoadingState}
      displayImpactsAccuracyDisclaimer={displayImpactsAccuracyDisclaimer}
      onEvaluationPeriodChange={(evaluationPeriodInYears: number) =>
        dispatch(evaluationPeriodUpdated(evaluationPeriodInYears))
      }
      onExportModalOpened={() => void dispatch(eventTracked(impactsExportModalOpened()))}
      modalsData={modalsData!}
    />
  );
}

export default ProjectPageContainer;

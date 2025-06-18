import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { fetchUrbanSprawlImpactsComparison } from "../../application/project-impacts-urban-sprawl-comparison/fetchUrbanSprawlImpactsComparison.action";
import {
  setEvaluationPeriod,
  setViewMode,
  ViewMode,
} from "../../application/project-impacts-urban-sprawl-comparison/urbanSprawlComparison.reducer";
import ImpactsComparisonPage from "./ImpactsComparisonPage";

type Props = {
  projectId: string;
};

function ImpactsComparisonPageContainer({ projectId }: Props) {
  const dispatch = useAppDispatch();

  const comparisonState = useAppSelector((state) => state.urbanSprawlComparison);

  useEffect(() => {
    void dispatch(
      fetchUrbanSprawlImpactsComparison({
        projectId,
        evaluationPeriod: comparisonState.evaluationPeriod,
        comparisonSiteNature: "AGRICULTURAL_OPERATION",
      }),
    );
  }, [projectId, dispatch, comparisonState.evaluationPeriod]);

  return (
    <ImpactsComparisonPage
      projectId={projectId}
      {...comparisonState}
      onEvaluationPeriodChange={(evaluationPeriod: number) =>
        dispatch(setEvaluationPeriod(evaluationPeriod))
      }
      onCurrentViewModeChange={(viewMode: ViewMode) => dispatch(setViewMode(viewMode))}
    />
  );
}

export default ImpactsComparisonPageContainer;

import { useEffect } from "react";
import { SiteNature } from "shared";

import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { fetchUrbanSprawlImpactsComparison } from "../../application/project-impacts-urban-sprawl-comparison/fetchUrbanSprawlImpactsComparison.action";
import {
  setComparisonSiteNature,
  setEvaluationPeriod,
  setViewMode,
  ViewMode,
} from "../../application/project-impacts-urban-sprawl-comparison/urbanSprawlComparison.reducer";
import ProjectImpactsUrbanSprawlImpactsComparisonView from "./ImpactsComparisonView";

type Props = {
  projectId: string;
};

function ImpactsComparisonPageContainer({ projectId }: Props) {
  const dispatch = useAppDispatch();

  const { comparisonSiteNature, evaluationPeriod, ...comparisonState } = useAppSelector(
    (state) => state.urbanSprawlComparison,
  );

  const {
    evaluationPeriod: projectImpactsEvaluationPeriod,
    dataLoadingState: projectImpactsLoadingState,
  } = useAppSelector((state) => state.projectImpacts);
  const relatedSiteNature = useAppSelector((state) => state.projectImpacts.relatedSiteData?.nature);

  useEffect(() => {
    if (projectImpactsEvaluationPeriod) {
      dispatch(setEvaluationPeriod(projectImpactsEvaluationPeriod));
    }
  }, [dispatch, projectImpactsEvaluationPeriod]);

  useEffect(() => {
    if (comparisonSiteNature) {
      void dispatch(
        fetchUrbanSprawlImpactsComparison({
          projectId: projectId,
          evaluationPeriod,
          comparisonSiteNature: comparisonSiteNature,
        }),
      );
    }
  }, [dispatch, projectId, evaluationPeriod, comparisonSiteNature]);

  const onSelectComparisonSiteNature = (selectedSiteNature: SiteNature) => {
    dispatch(setComparisonSiteNature(selectedSiteNature));
  };

  return (
    <ProjectImpactsUrbanSprawlImpactsComparisonView
      projectId={projectId}
      relatedSiteNature={relatedSiteNature!}
      evaluationPeriod={evaluationPeriod}
      projectImpactsLoadingState={projectImpactsLoadingState}
      {...comparisonState}
      onSelectComparisonSiteNature={onSelectComparisonSiteNature}
      onEvaluationPeriodChange={(evaluationPeriod: number) =>
        dispatch(setEvaluationPeriod(evaluationPeriod))
      }
      onCurrentViewModeChange={(viewMode: ViewMode) => dispatch(setViewMode(viewMode))}
    />
  );
}

export default ImpactsComparisonPageContainer;

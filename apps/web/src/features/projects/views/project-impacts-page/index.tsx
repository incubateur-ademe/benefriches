import { useEffect } from "react";
import { fetchReconversionProjectImpacts } from "../../application/fetchReconversionProjectImpacts.action";
import {
  getProjectContext,
  ImpactCategoryFilter,
  setCategoryFilter,
  setEvaluationPeriod,
  setViewMode,
  ViewMode,
} from "../../application/projectImpacts.reducer";
import ProjectImpactsPageWrapper from "./ProjectImpactsPageWrapper";

import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

type Props = {
  projectId: string;
};

function ProjectsImpacts({ projectId }: Props) {
  const dispatch = useAppDispatch();

  const { dataLoadingState, evaluationPeriod, currentCategoryFilter, currentViewMode } =
    useAppSelector((state) => state.projectImpacts);

  const projectContext = useAppSelector(getProjectContext);

  useEffect(() => {
    void dispatch(fetchReconversionProjectImpacts({ projectId, evaluationPeriod }));
  }, [projectId, evaluationPeriod, dispatch]);

  return (
    <ProjectImpactsPageWrapper
      projectContext={projectContext}
      dataLoadingState={dataLoadingState}
      evaluationPeriod={evaluationPeriod}
      currentViewMode={currentViewMode}
      currentCategoryFilter={currentCategoryFilter}
      onEvaluationPeriodChange={(evaluationPeriod: number) =>
        dispatch(setEvaluationPeriod(evaluationPeriod))
      }
      onCurrentCategoryFilterChange={(category: ImpactCategoryFilter) =>
        dispatch(setCategoryFilter(category))
      }
      onCurrentViewModeChange={(viewMode: ViewMode) => dispatch(setViewMode(viewMode))}
    />
  );
}

export default ProjectsImpacts;

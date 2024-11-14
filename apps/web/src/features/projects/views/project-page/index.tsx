import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { fetchReconversionProjectImpacts } from "../../application/fetchReconversionProjectImpacts.action";
import { fetchProjectFeatures } from "../../application/project-features/projectFeatures.actions";
import { selectProjectFeatures } from "../../application/project-features/projectFeatures.reducer";
import {
  getProjectContext,
  ImpactCategoryFilter,
  setCategoryFilter,
  setEvaluationPeriod,
  setViewMode,
  ViewMode,
} from "../../application/projectImpacts.reducer";
import ProjectPage from "./ProjectImpactsPage";

type Props = {
  projectId: string;
};

function ProjectPageContainer({ projectId }: Props) {
  const dispatch = useAppDispatch();

  const { dataLoadingState, evaluationPeriod, currentCategoryFilter, currentViewMode } =
    useAppSelector((state) => state.projectImpacts);

  const projectContext = useAppSelector(getProjectContext);

  useEffect(() => {
    void dispatch(fetchReconversionProjectImpacts({ projectId, evaluationPeriod }));
  }, [projectId, evaluationPeriod, dispatch]);

  const projectFeatures = useAppSelector(selectProjectFeatures);

  const onFetchProjectFeatures = () => {
    void dispatch(fetchProjectFeatures({ projectId }));
  };

  return (
    <ProjectPage
      projectId={projectId}
      projectContext={projectContext}
      projectFeaturesData={projectFeatures}
      onFetchProjectFeatures={onFetchProjectFeatures}
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

export default ProjectPageContainer;

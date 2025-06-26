import { useEffect } from "react";
import { Route } from "type-route";

import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";
import { routes } from "@/shared/views/router";

import { fetchUrbanSprawlImpactsComparison } from "../../application/project-impacts-urban-sprawl-comparison/fetchUrbanSprawlImpactsComparison.action";
import {
  setEvaluationPeriod,
  setViewMode,
  ViewMode,
} from "../../application/project-impacts-urban-sprawl-comparison/urbanSprawlComparison.reducer";
import ImpactsComparisonPage from "./ImpactsComparisonPage";
import UrbanSprawlImpactsComparisonIntroduction from "./introduction/Introduction";

type Props = {
  route: Route<typeof routes.urbanSprawlImpactsComparison>;
};

function ImpactsComparisonPageContainer({ route }: Props) {
  const dispatch = useAppDispatch();

  const comparisonState = useAppSelector((state) => state.urbanSprawlComparison);

  useEffect(() => {
    void dispatch(
      fetchUrbanSprawlImpactsComparison({
        projectId: route.params.projectId,
        evaluationPeriod: comparisonState.evaluationPeriod,
        comparisonSiteNature: comparisonState.comparisonSiteNature,
      }),
    );
  }, [
    dispatch,
    route.params.projectId,
    comparisonState.evaluationPeriod,
    comparisonState.comparisonSiteNature,
  ]);

  if (route.params.page === "introduction") {
    return (
      <UrbanSprawlImpactsComparisonIntroduction
        routeStep={route.params.etape}
        onNextToStep={(step: string) => {
          routes
            .urbanSprawlImpactsComparison({
              projectId: route.params.projectId,
              page: "introduction",
              etape: step,
            })
            .push();
        }}
        onBackToStep={(step: string) => {
          routes
            .urbanSprawlImpactsComparison({
              projectId: route.params.projectId,
              page: "introduction",
              etape: step,
            })
            .replace();
        }}
        onFinalNext={() => {
          routes.urbanSprawlImpactsComparison({ projectId: route.params.projectId }).push();
        }}
        dataLoadingState={comparisonState.dataLoadingState}
        projectName={comparisonState.projectData?.name}
        baseSiteData={comparisonState.baseCase?.conversionSiteData}
        comparisonSiteData={comparisonState.comparisonCase?.conversionSiteData}
      />
    );
  }

  return (
    <ImpactsComparisonPage
      projectId={route.params.projectId}
      {...comparisonState}
      onEvaluationPeriodChange={(evaluationPeriod: number) =>
        dispatch(setEvaluationPeriod(evaluationPeriod))
      }
      onCurrentViewModeChange={(viewMode: ViewMode) => dispatch(setViewMode(viewMode))}
    />
  );
}

export default ImpactsComparisonPageContainer;

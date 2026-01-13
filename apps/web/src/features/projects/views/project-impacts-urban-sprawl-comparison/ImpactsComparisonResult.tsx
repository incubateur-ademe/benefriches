import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";

import {
  UrbanSprawlImpactsComparisonState,
  ViewMode,
} from "../../application/project-impacts-urban-sprawl-comparison/urbanSprawlComparison.reducer.ts";
import ProjectPageHeader from "../project-page/header";
import ProjectImpactsActionBar from "../shared/actions/ProjectImpactsActionBar";
import ImpactComparisonListView from "./list-view/ImpactsComparisonListView";
import ImpactsSummaryViewContainer from "./summary-view";

type Props = {
  projectId: string;
  onEvaluationPeriodChange: (n: number) => void;
  onCurrentViewModeChange: (n: ViewMode) => void;
} & Pick<
  Required<UrbanSprawlImpactsComparisonState>,
  "baseCase" | "comparisonCase" | "currentViewMode" | "evaluationPeriod" | "projectData"
>;

function ImpactsComparisonResult({
  evaluationPeriod,
  currentViewMode,
  projectData,
  baseCase,
  comparisonCase,
  onCurrentViewModeChange,
  onEvaluationPeriodChange,
}: Props) {
  return (
    <>
      <ProjectImpactsActionBar
        selectedViewMode={currentViewMode}
        evaluationPeriod={evaluationPeriod}
        onViewModeClick={onCurrentViewModeChange}
        onEvaluationPeriodChange={onEvaluationPeriodChange}
        header={<ProjectPageHeader projectId={projectData.id} />}
        segments={["summary", "list"]}
        className="py-12 mb-2"
      />

      {currentViewMode === "summary" && (
        <>
          <HtmlTitle>{`Synthèse - ${projectData.name} - Comparaison des impacts`}</HtmlTitle>
          <ImpactsSummaryViewContainer />
        </>
      )}
      {currentViewMode === "list" && (
        <>
          <HtmlTitle>{`Liste - ${projectData.name} - Comparaison des impacts`}</HtmlTitle>
          <ImpactComparisonListView
            projectType={projectData.developmentPlan.type}
            baseCase={{
              siteNature: baseCase.conversionSiteData.nature,
              impacts: baseCase.comparisonImpacts,
            }}
            comparisonCase={{
              siteNature: comparisonCase.conversionSiteData.nature,
              impacts: comparisonCase.comparisonImpacts,
            }}
          />
        </>
      )}
    </>
  );
}

export default ImpactsComparisonResult;

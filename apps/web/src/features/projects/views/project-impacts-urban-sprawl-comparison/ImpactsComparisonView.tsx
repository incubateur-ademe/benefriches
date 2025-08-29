import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";

import { UrbanSprawlImpactsComparisonState } from "../../application/project-impacts-urban-sprawl-comparison/urbanSprawlComparison.reducer";
import { ViewMode } from "../../application/project-impacts/projectImpacts.reducer";
import ProjectImpactsActionBar from "../shared/actions/ProjectImpactsActionBar";
import ImpactsComparisonFooter from "./ImpactsComparisonFooter";
import ImpactsComparisonHeader from "./ImpactsComparisonHeader";
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

const ImpactsComparisonView = ({
  evaluationPeriod,
  currentViewMode,
  projectData,
  baseCase,
  comparisonCase,
  onCurrentViewModeChange,
  onEvaluationPeriodChange,
}: Props) => {
  const headerProps = {
    projectType: projectData.developmentPlan.type,
    projectName: projectData.name,
    baseSiteName: baseCase.conversionSiteData.name,
    comparisonSiteName: comparisonCase.conversionSiteData.name,
  };

  return (
    <>
      <ImpactsComparisonHeader {...headerProps} className="py-8" />

      <div className="fr-container pb-14">
        <ProjectImpactsActionBar
          selectedViewMode={currentViewMode}
          evaluationPeriod={evaluationPeriod}
          onViewModeClick={onCurrentViewModeChange}
          onEvaluationPeriodChange={onEvaluationPeriodChange}
          header={<ImpactsComparisonHeader {...headerProps} />}
          disabledSegments={["charts"]}
          className="py-4 mb-2"
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
                siteName: baseCase.conversionSiteData.name,
                impacts: baseCase.comparisonImpacts,
              }}
              comparisonCase={{
                siteName: comparisonCase.conversionSiteData.name,
                impacts: comparisonCase.comparisonImpacts,
              }}
            />
          </>
        )}
        {currentViewMode === "charts" && <h2 className="py-10"> 🏗️ Bientôt disponible...</h2>}
        <ImpactsComparisonFooter
          baseCaseSiteData={baseCase.conversionSiteData}
          comparisonCaseSiteData={comparisonCase.conversionSiteData}
          projectData={projectData}
        />
      </div>
    </>
  );
};

export default ImpactsComparisonView;

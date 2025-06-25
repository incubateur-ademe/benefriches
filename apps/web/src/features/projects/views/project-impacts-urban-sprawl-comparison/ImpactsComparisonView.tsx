import { UrbanSprawlImpactsComparisonState } from "../../application/project-impacts-urban-sprawl-comparison/urbanSprawlComparison.reducer";
import { ViewMode } from "../../application/project-impacts/projectImpacts.reducer";
import ProjectImpactsActionBar from "../shared/actions/ProjectImpactsActionBar";
import ImpactsComparisonFooter from "./ImpactsComparisonFooter";
import ImpactsComparisonHeader from "./ImpactsComparisonHeader";
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
      <ImpactsComparisonHeader {...headerProps} className="tw-py-8" />

      <div className="fr-container tw-pb-14">
        <ProjectImpactsActionBar
          selectedViewMode={currentViewMode}
          evaluationPeriod={evaluationPeriod}
          onViewModeClick={onCurrentViewModeChange}
          onEvaluationPeriodChange={onEvaluationPeriodChange}
          header={<ImpactsComparisonHeader {...headerProps} />}
          disabledSegments={["list", "charts"]}
        />

        {currentViewMode === "summary" && <ImpactsSummaryViewContainer />}
        {currentViewMode === "list" && <h2 className="tw-py-10">🏗️ Bientôt disponible...</h2>}
        {currentViewMode === "charts" && <h2 className="tw-py-10"> 🏗️ Bientôt disponible...</h2>}
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

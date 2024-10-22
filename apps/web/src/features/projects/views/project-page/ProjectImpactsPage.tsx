import Alert from "@codegouvfr/react-dsfr/Alert";

import classNames from "@/shared/views/clsx";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import {
  ImpactCategoryFilter,
  ProjectImpactsState,
  ViewMode,
} from "../../application/projectImpacts.reducer";
import { ProjectDevelopmentPlanType } from "../../domain/projects.types";
import ProjectImpactsActionBar from "./ProjectImpactsActionBar";
import ProjectsImpactsPageHeader from "./ProjectPageHeader";
import ProjectImpactsPage from "./impacts/ProjectImpactsView";

type Props = {
  projectId: string;
  dataLoadingState: ProjectImpactsState["dataLoadingState"];
  projectContext: {
    name: string;
    siteName: string;
    siteId: string;
    type?: ProjectDevelopmentPlanType;
    isExpressProject: boolean;
  };
  onEvaluationPeriodChange: (n: number) => void;
  evaluationPeriod: number;
  onCurrentCategoryFilterChange: (n: ImpactCategoryFilter) => void;
  currentCategoryFilter: ImpactCategoryFilter;
  onCurrentViewModeChange: (n: ViewMode) => void;
  currentViewMode: ViewMode;
};

function ProjectPage({
  projectId,
  projectContext,
  dataLoadingState,
  onEvaluationPeriodChange,
  evaluationPeriod,
  currentCategoryFilter,
  currentViewMode,
  onCurrentViewModeChange,
  onCurrentCategoryFilterChange,
}: Props) {
  return (
    <div
      id="project-impacts-page"
      className={classNames("tw-bg-grey-light dark:tw-bg-grey-dark", "tw-h-full")}
    >
      <div className="tw-py-8">
        <ProjectsImpactsPageHeader
          projectType={projectContext.type}
          projectId={projectId}
          siteId={projectContext.siteId}
          projectName={projectContext.name}
          siteName={projectContext.siteName}
          isExpressProject={projectContext.isExpressProject}
        />
      </div>

      <div className="fr-container">
        <ProjectImpactsActionBar
          projectName={projectContext.name}
          projectId={projectId}
          siteName={projectContext.siteName}
          siteId={projectContext.siteId}
          isExpressProject={projectContext.isExpressProject}
          selectedFilter={currentCategoryFilter}
          selectedViewMode={currentViewMode}
          evaluationPeriod={evaluationPeriod}
          onFilterClick={onCurrentCategoryFilterChange}
          onViewModeClick={onCurrentViewModeChange}
          onEvaluationPeriodChange={onEvaluationPeriodChange}
        />
        {dataLoadingState === "error" && (
          <Alert
            description="Une erreur s'est produite lors du chargement des données, veuillez réessayer."
            severity="error"
            title="Impossible de charger les impacts et caractéristiques du projet"
            className="tw-my-7"
          />
        )}
        {dataLoadingState === "loading" && <LoadingSpinner />}
        {dataLoadingState === "success" && (
          <ProjectImpactsPage
            evaluationPeriod={evaluationPeriod}
            currentViewMode={currentViewMode}
          />
        )}
      </div>
    </div>
  );
}

export default ProjectPage;

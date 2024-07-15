import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import {
  ImpactCategoryFilter,
  ProjectImpactsState,
  ViewMode,
} from "../../application/projectImpacts.reducer";
import { ProjectDevelopmentPlanType } from "../../domain/projects.types";
import ProjectFeaturesView from "./features/ProjectFeaturesView";
import ProjectImpactsPage from "./impacts/ProjectImpactsView";
import ProjectImpactsActionBar from "./ProjectImpactsActionBar";
import ProjectsImpactsPageHeader from "./ProjectPageHeader";

import classNames from "@/shared/views/clsx";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

type Props = {
  dataLoadingState: ProjectImpactsState["dataLoadingState"];
  projectContext: {
    name: string;
    siteName: string;
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

const getProjectTypeClassName = (type?: ProjectDevelopmentPlanType) => {
  switch (type) {
    case "MIXED_USE_NEIGHBOURHOOD":
      return "mixed-use-neighbourhood";
    case "PHOTOVOLTAIC_POWER_PLANT":
      return "photovoltaic";
    default:
      return "";
  }
};

function ProjectPage({
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
      className={classNames(
        getProjectTypeClassName(projectContext.type),
        "tw-bg-impacts-main",
        "dark:tw-bg-grey-dark",
      )}
    >
      <div className={classNames(fr.cx("fr-py-8v"), "tw-bg-impacts-main", "dark:tw-bg-grey-dark")}>
        <ProjectsImpactsPageHeader
          projectType={projectContext.type}
          projectName={projectContext.name}
          siteName={projectContext.siteName}
          isExpressProject={projectContext.isExpressProject}
        />
      </div>
      <div className={fr.cx("fr-tabs")}>
        <div className="fr-container">
          <ul
            className={classNames(fr.cx("fr-tabs__list", "fr-mx-auto"))}
            role="tablist"
            aria-label="Onglets de la page projet"
          >
            <li role="presentation">
              <button
                id="tabpanel-impacts"
                className="fr-tabs__tab"
                tabIndex={0}
                role="tab"
                aria-selected="true"
                aria-controls="tabpanel-impacts-panel"
              >
                Impacts
              </button>
            </li>
            <li role="presentation">
              <button
                id="tabpanel-caracteristiques"
                className="fr-tabs__tab"
                tabIndex={1}
                role="tab"
                aria-selected="false"
                aria-controls="tabpanel-caracteristiques-panel"
                disabled
              >
                Caractéristiques
              </button>
            </li>
          </ul>
        </div>
        <div
          id="tabpanel-impacts-panel"
          className="fr-tabs__panel fr-tabs__panel--selected tw-bg-dsfr-grey"
          role="tabpanel"
          aria-labelledby="tabpanel-impacts"
          tabIndex={0}
        >
          <div className="fr-container">
            <ProjectImpactsActionBar
              projectName={projectContext.name}
              siteName={projectContext.siteName}
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
                className="fr-my-7v"
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
        <div
          id="tabpanel-caracteristiques-panel"
          className="fr-tabs__panel tw-bg-dsfr-grey"
          role="tabpanel"
          aria-labelledby="tabpanel-caracteristiques"
          tabIndex={1}
        >
          <ProjectFeaturesView />
        </div>
      </div>
    </div>
  );
}

export default ProjectPage;

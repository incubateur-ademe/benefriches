import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import {
  ImpactCategoryFilter,
  ProjectImpactsState,
  ViewMode,
} from "../../application/projectImpacts.reducer";
import { ProjectDevelopmentPlanType } from "../../domain/projects.types";
import ProjectImpactsActionBar from "./ProjectImpactsActionBar";
import ProjectImpactsPage from "./ProjectImpactsPage";
import ProjectsImpactsPageHeader from "./ProjectImpactsPageHeader";

import classNames from "@/shared/views/clsx";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

type Props = {
  dataLoadingState: ProjectImpactsState["dataLoadingState"];
  projectContext: {
    name: string;
    siteName: string;
    type?: ProjectDevelopmentPlanType;
  };
  onEvaluationPeriodChange: (n: number) => void;
  evaluationPeriod: number;
  onCurrentCategoryFilterChange: (n: ImpactCategoryFilter) => void;
  currentCategoryFilter: ImpactCategoryFilter;
  onCurrentViewModeChange: (n: ViewMode) => void;
  currentViewMode: ViewMode;
};

const ProjectImpactsPageTabs = () => {
  return (
    <ul
      className={classNames(fr.cx("fr-tabs__list", "fr-container", "fr-mx-auto"), "tw-mx-auto")}
      role="tablist"
    >
      <li role="presentation">
        <button className="fr-tabs__tab" tabIndex={0} role="tab" aria-selected="true">
          Impacts
        </button>
      </li>
      {/* <li role="presentation">
        <button className="fr-tabs__tab" tabIndex={1} role="tab" disabled>
          Caractéristiques
        </button>
      </li> */}
    </ul>
  );
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

function ProjectImpactsPageWrapper({
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
        />
      </div>

      <div className={fr.cx("fr-tabs")}>
        <ProjectImpactsPageTabs />
        <div
          className={classNames(
            fr.cx("fr-tabs__panel", "fr-tabs__panel--selected"),
            "tw-bg-dsfr-grey",
          )}
          role="tabpanel"
        >
          <div className={fr.cx("fr-container")}>
            <ProjectImpactsActionBar
              projectName={projectContext.name}
              siteName={projectContext.siteName}
              selectedFilter={currentCategoryFilter}
              selectedViewMode={currentViewMode}
              evaluationPeriod={evaluationPeriod}
              onFilterClick={onCurrentCategoryFilterChange}
              onViewModeClick={onCurrentViewModeChange}
              onEvaluationPeriodChange={onEvaluationPeriodChange}
            />
            {dataLoadingState === "error" && (
              <Alert
                description="Une erreur s'est produite lors du chargement des données."
                severity="error"
                title="Impossible de charger les impacts du projet"
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
      </div>
    </div>
  );
}

export default ProjectImpactsPageWrapper;

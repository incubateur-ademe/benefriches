import Alert from "@codegouvfr/react-dsfr/Alert";
import { useWindowInnerSize } from "@codegouvfr/react-dsfr/tools/useWindowInnerSize";
import { useBreakpointsValuesPx } from "@codegouvfr/react-dsfr/useBreakpointsValuesPx";

import { routes } from "@/app/views/router";
import classNames from "@/shared/views/clsx";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import {
  ImpactCategoryFilter,
  ProjectImpactsState,
  ViewMode,
} from "../../application/projectImpacts.reducer";
import { ProjectDevelopmentPlanType, ProjectFeatures } from "../../domain/projects.types";
import ProjectImpactsActionBar from "./header/ProjectImpactsActionBar";
import ProjectsImpactsPageHeader from "./header/ProjectPageHeader";
import ProjectImpactsPage from "./impacts/ProjectImpactsView";

type Props = {
  projectId: string;
  dataLoadingState: ProjectImpactsState["dataLoadingState"];
  projectFeaturesData?: ProjectFeatures;
  onFetchProjectFeatures?: () => void;
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
  projectFeaturesData,
  onFetchProjectFeatures,
  dataLoadingState,
  onEvaluationPeriodChange,
  evaluationPeriod,
  currentCategoryFilter,
  currentViewMode,
  onCurrentViewModeChange,
  onCurrentCategoryFilterChange,
}: Props) {
  const { breakpointsValues } = useBreakpointsValuesPx();
  const { windowInnerWidth } = useWindowInnerSize();

  const isSmScreen = windowInnerWidth < breakpointsValues.sm;

  const headerProps = {
    projectType: projectContext.type,
    projectFeaturesData: projectFeaturesData,
    onFetchProjectFeatures: onFetchProjectFeatures,
    projectName: projectContext.name,
    siteName: projectContext.siteName,
    isExpressProject: projectContext.isExpressProject,
    siteFeaturesHref: routes.siteFeatures({ siteId: projectContext.siteId }).href,
    onGoToImpactsOnBoarding: () => {
      routes.projectImpactsOnboarding({ projectId }).push();
    },
  };

  return (
    <div
      id="project-impacts-page"
      className={classNames("tw-bg-grey-light dark:tw-bg-grey-dark", "tw-h-full")}
    >
      <div className="tw-pt-8 md:tw-pb-8">
        <ProjectsImpactsPageHeader {...headerProps} />
      </div>

      <div className="fr-container">
        <ProjectImpactsActionBar
          selectedFilter={currentCategoryFilter}
          selectedViewMode={currentViewMode}
          evaluationPeriod={evaluationPeriod}
          onFilterClick={onCurrentCategoryFilterChange}
          onViewModeClick={onCurrentViewModeChange}
          onEvaluationPeriodChange={onEvaluationPeriodChange}
          isSmScreen={isSmScreen}
          headerProps={headerProps}
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

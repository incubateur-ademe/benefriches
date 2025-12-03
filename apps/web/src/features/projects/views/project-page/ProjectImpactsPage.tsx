import Alert from "@codegouvfr/react-dsfr/Alert";
import { SiteNature } from "shared";

import classNames from "@/shared/views/clsx";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import { routes } from "@/shared/views/router.ts";

import {
  ProjectImpactsState,
  ViewMode,
} from "../../application/project-impacts/projectImpacts.reducer.ts";
import { ProjectDevelopmentPlanType } from "../../domain/projects.types";
import ProjectImpactsActionBar from "../shared/actions/ProjectImpactsActionBar.tsx";
import { PROJECT_AND_SITE_FEATURES_BADGE_DIALOG_ID } from "./ExpressProjectBadge.tsx";
import ExportImpactsModal from "./export-impacts/ExportModal";
import { PROJECT_AND_SITE_FEATURES_FOOTER_DIALOG_ID } from "./footer/FutherActionsSection.tsx";
import ProjectImpactFooter from "./footer/ProjectImpactFooter";
import ProjectsImpactsPageHeader from "./header/ProjectPageHeader";
import ImpactsAccuracyDisclaimer from "./impacts-accuracy-disclaimer/ImpactsAccuracyDisclaimer";
import ProjectImpactsPage from "./impacts/ProjectImpactsView";
import AboutImpactsModal from "./impacts/about-impacts-modal/AboutImpactsModal.tsx";
import ProjectFeaturesModal from "./impacts/project-and-site-features-modal/index.tsx";

type Props = {
  projectId: string;
  dataLoadingState: ProjectImpactsState["dataLoadingState"];
  projectContext: {
    name: string;
    siteName: string;
    siteNature?: SiteNature;
    siteId: string;
    type?: ProjectDevelopmentPlanType;
    isExpressProject: boolean;
  };
  onEvaluationPeriodChange: (n: number) => void;
  evaluationPeriod: number | undefined;
  onCurrentViewModeChange: (n: ViewMode) => void;
  currentViewMode: ViewMode;
  displayImpactsAccuracyDisclaimer: boolean;
};

function ProjectPage({
  projectId,
  projectContext,
  dataLoadingState,
  onEvaluationPeriodChange,
  evaluationPeriod,
  currentViewMode,
  onCurrentViewModeChange,
  displayImpactsAccuracyDisclaimer,
}: Props) {
  const headerProps = {
    projectType: projectContext.type,
    projectName: projectContext.name,
    siteName: projectContext.siteName,
    isExpressProject: projectContext.isExpressProject,
    siteFeaturesHref: routes.siteFeatures({ siteId: projectContext.siteId }).href,
  };

  return (
    <div
      id="project-impacts-page"
      className={classNames("bg-grey-light dark:bg-grey-dark", "h-full")}
    >
      <div className="py-8">
        <ProjectsImpactsPageHeader {...headerProps} />
      </div>

      <div className="fr-container pb-14">
        {displayImpactsAccuracyDisclaimer && <ImpactsAccuracyDisclaimer />}

        <ProjectImpactsActionBar
          selectedViewMode={currentViewMode}
          evaluationPeriod={evaluationPeriod}
          onViewModeClick={onCurrentViewModeChange}
          onEvaluationPeriodChange={onEvaluationPeriodChange}
          header={<ProjectsImpactsPageHeader {...headerProps} />}
        />
        {dataLoadingState === "error" && (
          <Alert
            description="Une erreur s'est produite lors du chargement des données, veuillez réessayer."
            severity="error"
            title="Impossible de charger les impacts et caractéristiques du projet"
            className="my-7"
          />
        )}
        {dataLoadingState === "loading" && <LoadingSpinner />}
        {dataLoadingState === "success" && (
          <>
            <ProjectImpactsPage
              currentViewMode={currentViewMode}
              projectName={projectContext.name}
            />
            <ProjectImpactFooter
              siteId={projectContext.siteId}
              siteNature={projectContext.siteNature!}
              projectId={projectId}
              evaluationPeriod={evaluationPeriod}
              isUpdateEnabled={
                projectContext.type === "URBAN_PROJECT" && !projectContext.isExpressProject
              }
            />
          </>
        )}
      </div>

      <AboutImpactsModal />
      <ProjectFeaturesModal
        dialogId={PROJECT_AND_SITE_FEATURES_BADGE_DIALOG_ID}
        projectId={projectId}
        siteId={projectContext.siteId}
      />
      <ProjectFeaturesModal
        dialogId={PROJECT_AND_SITE_FEATURES_FOOTER_DIALOG_ID}
        projectId={projectId}
        siteId={projectContext.siteId}
      />
      <ExportImpactsModal projectId={projectId} siteId={projectContext.siteId} />
    </div>
  );
}

export default ProjectPage;

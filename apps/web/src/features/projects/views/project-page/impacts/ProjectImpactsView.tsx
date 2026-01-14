import Alert from "@codegouvfr/react-dsfr/Alert";
import { SiteNature } from "shared";

import { ProjectDevelopmentPlanType } from "@/features/projects/domain/projects.types";
import { impactsExportModalOpened, trackEvent } from "@/shared/views/analytics";
import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import {
  ProjectImpactsState,
  ViewMode,
} from "../../../application/project-impacts/projectImpacts.reducer";
import { exportImpactsModal } from "../../project-page/export-impacts/createExportModal";
import ProjectImpactsActionBar from "../../shared/actions/ProjectImpactsActionBar";
import ExportImpactsModal from "../export-impacts/ExportModal";
import ProjectImpactFooter from "../footer/ProjectImpactFooter";
import ProjectPageHeader from "../header";
import ImpactsAccuracyDisclaimer from "../impacts-accuracy-disclaimer/ImpactsAccuracyDisclaimer";
import AboutImpactsModalButton from "./about-impacts-modal/AboutImpactsModalButton";
import ImpactsChartsView from "./charts-view";
import ImpactsListViewContainer from "./list-view";
import ImpactsSummaryViewContainer from "./summary-view";

type Props = {
  currentViewMode: ViewMode;
  projectName: string;
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
  displayImpactsAccuracyDisclaimer: boolean;
};

const ProjectImpactsView = ({
  currentViewMode,
  projectName,
  displayImpactsAccuracyDisclaimer,
  projectId,
  projectContext,
  dataLoadingState,
  onEvaluationPeriodChange,
  evaluationPeriod,
  onCurrentViewModeChange,
}: Props) => {
  return (
    <>
      {displayImpactsAccuracyDisclaimer && <ImpactsAccuracyDisclaimer />}

      <ProjectImpactsActionBar
        selectedViewMode={currentViewMode}
        evaluationPeriod={evaluationPeriod}
        onViewModeClick={onCurrentViewModeChange}
        onEvaluationPeriodChange={onEvaluationPeriodChange}
        header={<ProjectPageHeader projectId={projectId} />}
        onDownloadImpacts={() => {
          trackEvent(impactsExportModalOpened());
          exportImpactsModal.open();
        }}
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
          {currentViewMode === "summary" && (
            <>
              <HtmlTitle>{`Synthèse - ${projectName} - Impacts`}</HtmlTitle>
              <ImpactsSummaryViewContainer />
            </>
          )}
          {currentViewMode === "list" && (
            <>
              <HtmlTitle>{`Liste - ${projectName} - Impacts`}</HtmlTitle>
              <ImpactsListViewContainer />
            </>
          )}
          {currentViewMode === "charts" && (
            <>
              <HtmlTitle>{`Graphique - ${projectName} - Impacts`}</HtmlTitle>
              <ImpactsChartsView />
            </>
          )}
          <ProjectImpactFooter
            siteId={projectContext.siteId}
            projectId={projectId}
            evaluationPeriod={evaluationPeriod}
            isUpdateEnabled={
              projectContext.type === "URBAN_PROJECT" && !projectContext.isExpressProject
            }
          />

          <div className="py-8">
            💡 Comment sont calculés les indicateurs ? Qu’est-ce qu’un impact monétarisé ?
            Bénéfriches répond à toutes vos questions dans sa
            <AboutImpactsModalButton
              buttonProps={{
                className: "ml-2",
                children: "FAQ",
                iconId: "fr-icon-questionnaire-line",
                size: "small",
                priority: "tertiary",
              }}
            />
            .
          </div>
          <ExportImpactsModal projectId={projectId} siteId={projectContext.siteId} />
        </>
      )}
    </>
  );
};

export default ProjectImpactsView;

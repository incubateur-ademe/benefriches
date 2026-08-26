import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import { Route } from "type-route";

import { routes, useRoute } from "@/app/router";
import { ImpactsPageViewData } from "@/features/projects/application/project-impacts/selectors/projectImpacts.selectors";
import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import {
  ProjectImpactsState,
  ViewMode,
} from "../../../application/project-impacts/projectImpacts.reducer";
import ImpactModalDescriptionProvider from "../../impact-description-modals/ImpactModalDescription";
import { exportImpactsModal } from "../../project-page/export-impacts/createExportModal";
import ProjectImpactsActionBar from "../../shared/actions/ProjectImpactsActionBar";
import ExportImpactsModal from "../export-impacts/ExportModal";
import ProjectImpactFooter from "../footer/ProjectImpactFooter";
import ProjectPageHeader from "../header";
import ImpactsAccuracyDisclaimer from "../impacts-accuracy-disclaimer/ImpactsAccuracyDisclaimer";
import AboutImpactsModalButton from "./about-impacts-modal/AboutImpactsModalButton";
import ImpactsListViewContainer from "./list-view";
import ImpactsSummaryViewContainer from "./summary-view";

type Props = {
  currentViewMode: ViewMode;
  projectId: string;
  dataLoadingState: ProjectImpactsState["dataLoadingState"];
  contextData: ImpactsPageViewData["contextData"];
  impactsData: ImpactsPageViewData["impactsData"];
  onEvaluationPeriodChange: (n: number) => void;
  evaluationPeriod: number | undefined;
  onCurrentViewModeChange: (n: ViewMode) => void;
  onExportModalOpened: () => void;
  displayImpactsAccuracyDisclaimer: boolean;
};

const ProjectImpactsView = ({
  currentViewMode,
  displayImpactsAccuracyDisclaimer,
  projectId,
  contextData,
  impactsData,
  dataLoadingState,
  onEvaluationPeriodChange,
  evaluationPeriod,
  onCurrentViewModeChange,
  onExportModalOpened,
}: Props) => {
  const route = useRoute() as Route<typeof routes.projectImpacts>;
  return (
    <>
      <div className="flex justify-between items-center flex-wrap mb-10 gap-2">
        <h3 className="text-2xl mb-0">Évaluation des impacts</h3>
        <Button
          priority="primary"
          iconId="fr-icon-file-download-line"
          onClick={() => {
            onExportModalOpened();
            exportImpactsModal.open();
          }}
        >
          Télécharger les impacts
        </Button>
      </div>

      {displayImpactsAccuracyDisclaimer && <ImpactsAccuracyDisclaimer />}

      <ProjectImpactsActionBar
        selectedViewMode={currentViewMode}
        evaluationPeriod={evaluationPeriod}
        onViewModeClick={onCurrentViewModeChange}
        onEvaluationPeriodChange={onEvaluationPeriodChange}
        header={<ProjectPageHeader projectId={projectId} />}
      />

      {dataLoadingState.impacts === "error" && (
        <Alert
          description="Une erreur s'est produite lors du chargement des données, veuillez réessayer."
          severity="error"
          title="Impossible de charger les impacts et caractéristiques du projet"
          className="my-7"
        />
      )}
      {dataLoadingState.impacts === "loading" && <LoadingSpinner />}
      {dataLoadingState.impacts === "success" && (
        <ImpactModalDescriptionProvider
          route={route}
          getRouteFn={routes[route.name]}
          impactsData={impactsData!}
          contextData={contextData!}
        >
          {currentViewMode === "summary" && (
            <>
              <HtmlTitle>{`Synthèse - ${contextData?.projectName} - Impacts`}</HtmlTitle>
              <ImpactsSummaryViewContainer />
            </>
          )}
          {currentViewMode === "list" && (
            <>
              <HtmlTitle>{`Liste - ${contextData?.projectName} - Impacts`}</HtmlTitle>
              <ImpactsListViewContainer />
            </>
          )}
          <ProjectImpactFooter
            siteId={contextData?.relatedSiteId ?? ""}
            projectId={projectId}
            evaluationPeriod={evaluationPeriod}
            isUpdateEnabled={
              (contextData?.projectDevelopmentPlan.type === "URBAN_PROJECT" ||
                contextData?.projectDevelopmentPlan.type === "PHOTOVOLTAIC_POWER_PLANT") &&
              !contextData.isExpressProject
            }
            onExportModalOpened={onExportModalOpened}
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
          <ExportImpactsModal projectId={projectId} siteId={contextData?.relatedSiteId ?? ""} />
        </ImpactModalDescriptionProvider>
      )}
    </>
  );
};

export default ProjectImpactsView;

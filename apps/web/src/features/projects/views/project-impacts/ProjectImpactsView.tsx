import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import { useState } from "react";
import type { Route } from "type-route";

import { routes, useRoute } from "@/app/router";
import type { ImpactsPageViewData } from "@/features/projects/application/project-impacts/selectors/projectImpacts.selectors";
import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import type { ProjectImpactsState } from "../../application/project-impacts/projectImpacts.reducer";
import ImpactModalDescriptionProvider from "../impact-description-modals/ImpactModalDescription";
import ProjectImpactFooter from "../project-page/footer/ProjectImpactFooter";
import ProjectPageHeader from "../project-page/header";
import ImpactEvaluationPeriodSelect from "../shared/actions/ImpactEvaluationPeriodSelect";
import ProjectImpactsStickyActionBar from "../shared/actions/StickyActionBar";
import AboutImpactsModalButton from "./about-impacts-modal/AboutImpactsModalButton";
import ExportImpactsModal from "./export-impacts/ExportModal";
import { exportImpactsModal } from "./export-impacts/createExportModal";
import ImpactsAccuracyDisclaimer from "./impacts-accuracy-disclaimer/ImpactsAccuracyDisclaimer";
import ImpactsListViewContainer from "./list-view";

type Props = {
  projectId: string;
  dataLoadingState: ProjectImpactsState["dataLoadingState"];
  contextData: ImpactsPageViewData["contextData"];
  modalsData: ImpactsPageViewData["modalsData"];
  onEvaluationPeriodChange: (n: number) => void;
  evaluationPeriod: number | undefined;
  onExportModalOpened: () => void;
  displayImpactsAccuracyDisclaimer: boolean;
};

const ProjectImpactsView = ({
  displayImpactsAccuracyDisclaimer,
  projectId,
  contextData,
  dataLoadingState,
  onEvaluationPeriodChange,
  evaluationPeriod,
  onExportModalOpened,
  modalsData,
}: Props) => {
  const route = useRoute() as Route<typeof routes.projectImpacts>;
  const [isActionBarInViewport, setIsActionBarInViewPort] = useState(false);

  const inlineActionBarRef = (node: HTMLDivElement) => {
    const observer = new IntersectionObserver(([entry]) => {
      const entryIntersecting = entry?.isIntersecting ?? false;
      setIsActionBarInViewPort(entryIntersecting);
    });
    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  };

  return (
    <>
      <div className="flex justify-between items-center flex-wrap mb-10 gap-2">
        <h3 className="text-2xl mb-0">Évaluation des impacts</h3>
        <div className="flex gap-2">
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
          {!isActionBarInViewport && (
            <ProjectImpactsStickyActionBar
              header={<ProjectPageHeader projectId={projectId} />}
              evaluationPeriod={evaluationPeriod}
              onEvaluationPeriodChange={onEvaluationPeriodChange}
            />
          )}
          {evaluationPeriod && (
            <div ref={inlineActionBarRef}>
              {" "}
              <ImpactEvaluationPeriodSelect
                onChange={onEvaluationPeriodChange}
                value={evaluationPeriod}
              />
            </div>
          )}
        </div>
      </div>

      {displayImpactsAccuracyDisclaimer && <ImpactsAccuracyDisclaimer />}

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
          {...modalsData!}
        >
          <>
            <HtmlTitle>{`Liste - ${contextData?.projectName} - Impacts`}</HtmlTitle>
            <ImpactsListViewContainer />
          </>
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

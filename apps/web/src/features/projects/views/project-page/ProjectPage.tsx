import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import type { Route } from "type-route";

import { useAppSelector } from "@/app/hooks/store.hooks";
import { type routes, useRoute } from "@/app/router";
import classNames from "@/shared/views/clsx";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import { selectImpactsPageViewData } from "../../application/project-impacts/selectors/projectImpacts.selectors";
import ProjectAvoidedCostsAnalysis from "../project-avoided-costs-analysis";
import ProjectBreakEvenLevelTabContainer from "../project-break-even-level";
import ProjectDevelopmentScore from "../project-development-score";
import ProjectFeaturesView from "../project-features";
import ProjectSummaryTab from "../project-summary/";
import ImpactsAccuracyDisclaimer from "./accuracy-disclaimer/ImpactsAccuracyDisclaimer";
import ProjectPageHeader from "./header/";
import ProjectPageTabs from "./header/ProjectPageTabs";

type Props = {
  projectId: string;
};

export type ProjectRoute =
  | Route<typeof routes.projectImpactsSummary>
  | Route<typeof routes.projectFeatures>
  | Route<typeof routes.projectImpactsBreakEvenLevel>
  | Route<typeof routes.projectImpactsDevelopmentScore>
  | Route<typeof routes.projectAvoidedCostsAnalysis>;

function ProjectPage({ projectId }: Props) {
  const route = useRoute() as ProjectRoute;
  const { dataLoadingState, displayImpactsAccuracyDisclaimer } =
    useAppSelector(selectImpactsPageViewData);

  return (
    <div id="project-impacts-page" className={classNames("h-full")}>
      <div className="mb-8 bg-grey-light dark:bg-grey-dark">
        <div className={classNames(fr.cx("fr-container"), "py-8")}>
          <ProjectPageHeader projectId={projectId} />
        </div>
        <ProjectPageTabs />
      </div>

      <div className="fr-container pb-14">
        {(() => {
          if (dataLoadingState === "error") {
            return (
              <Alert
                description="Une erreur s'est produite lors du chargement des données, veuillez réessayer."
                severity="error"
                title="Impossible de charger les impacts et caractéristiques du projet"
                className="my-7"
              />
            );
          } else if (dataLoadingState === "loading") {
            return <LoadingSpinner />;
          }

          switch (route.name) {
            case "projectFeatures":
              return <ProjectFeaturesView projectId={projectId} />;
            case "projectImpactsBreakEvenLevel":
              return (
                <>
                  {displayImpactsAccuracyDisclaimer && <ImpactsAccuracyDisclaimer />}
                  <ProjectBreakEvenLevelTabContainer projectId={projectId} />
                </>
              );
            case "projectImpactsSummary":
              return <ProjectSummaryTab projectId={projectId} />;
            case "projectImpactsDevelopmentScore":
              return (
                <>
                  {displayImpactsAccuracyDisclaimer && <ImpactsAccuracyDisclaimer />}
                  <ProjectDevelopmentScore projectId={projectId} />
                </>
              );
            case "projectAvoidedCostsAnalysis":
              return (
                <>
                  {displayImpactsAccuracyDisclaimer && <ImpactsAccuracyDisclaimer />}
                  <ProjectAvoidedCostsAnalysis projectId={projectId} />
                </>
              );
          }
        })()}
      </div>
    </div>
  );
}

export default ProjectPage;

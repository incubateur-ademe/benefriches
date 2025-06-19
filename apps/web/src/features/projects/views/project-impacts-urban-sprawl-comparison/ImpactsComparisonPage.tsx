import Alert from "@codegouvfr/react-dsfr/Alert";

import classNames from "@/shared/views/clsx";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import {
  UrbanSprawlImpactsComparisonState,
  ViewMode,
} from "../../application/project-impacts-urban-sprawl-comparison/urbanSprawlComparison.reducer.ts";
import ImpactsComparisonView from "./ImpactsComparisonView.tsx";

type Props = {
  projectId: string;
  onEvaluationPeriodChange: (n: number) => void;
  onCurrentViewModeChange: (n: ViewMode) => void;
} & Pick<
  UrbanSprawlImpactsComparisonState,
  | "baseCase"
  | "comparisonCase"
  | "currentViewMode"
  | "dataLoadingState"
  | "evaluationPeriod"
  | "projectData"
>;

function ImpactsComparisonPage({
  dataLoadingState,
  projectData,
  baseCase,
  comparisonCase,
  projectId,
  currentViewMode,
  evaluationPeriod,
  onCurrentViewModeChange,
  onEvaluationPeriodChange,
}: Props) {
  return (
    <div className={classNames("tw-bg-grey-light dark:tw-bg-grey-dark", "tw-h-full", "tw-pb-14")}>
      <div className="fr-container">
        {dataLoadingState === "error" && (
          <div className="tw-py-6">
            <h1 className="tw-text-sm tw-uppercase tw-font-normal tw-mb-1">
              Comparaison des impacts
            </h1>
            <Alert
              description="Une erreur s'est produite lors du chargement des données, veuillez réessayer."
              severity="error"
              title="Impossible de charger la comparaison des impacts du projet"
              className="tw-my-7"
            />
          </div>
        )}
        {dataLoadingState === "loading" && <LoadingSpinner />}
        {dataLoadingState === "success" && (
          <ImpactsComparisonView
            projectId={projectId}
            currentViewMode={currentViewMode}
            evaluationPeriod={evaluationPeriod}
            onCurrentViewModeChange={onCurrentViewModeChange}
            onEvaluationPeriodChange={onEvaluationPeriodChange}
            projectData={projectData!}
            baseCase={baseCase!}
            comparisonCase={comparisonCase!}
          />
        )}
      </div>
    </div>
  );
}

export default ImpactsComparisonPage;

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
    <div className={classNames("bg-grey-light dark:bg-grey-dark", "h-full", "pb-14")}>
      <div className="fr-container">
        {dataLoadingState === "error" && (
          <div className="py-6">
            <h1 className="text-sm uppercase font-normal mb-1">Comparaison des impacts</h1>
            <Alert
              description="Une erreur s'est produite lors du chargement des données, veuillez réessayer."
              severity="error"
              title="Impossible de charger la comparaison des impacts du projet"
              className="my-7"
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

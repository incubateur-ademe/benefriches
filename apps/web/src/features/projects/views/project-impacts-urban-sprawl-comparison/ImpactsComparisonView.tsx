import Alert from "@codegouvfr/react-dsfr/Alert";
import { SiteNature } from "shared";

import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import { UrbanSprawlImpactsComparisonState } from "../../application/project-impacts-urban-sprawl-comparison/urbanSprawlComparison.reducer";
import { ViewMode } from "../../application/project-impacts/projectImpacts.reducer";
import ImpactComparisonSelect from "./ImpactComparisonSelect";
import ImpactsComparisonResult from "./ImpactsComparisonResult";

type Props = {
  projectId: string;
  relatedSiteNature: SiteNature;
  projectImpactsLoadingState: "idle" | "success" | "error" | "loading";
  onEvaluationPeriodChange: (n: number) => void;
  onCurrentViewModeChange: (n: ViewMode) => void;
  onSelectComparisonSiteNature: (n: SiteNature) => void;
} & Pick<
  UrbanSprawlImpactsComparisonState,
  | "baseCase"
  | "comparisonCase"
  | "currentViewMode"
  | "dataLoadingState"
  | "evaluationPeriod"
  | "projectData"
>;

const ProjectImpactsUrbanSprawlImpactsComparisonView = ({
  dataLoadingState,
  projectData,
  baseCase,
  comparisonCase,
  projectId,
  relatedSiteNature,
  currentViewMode,
  evaluationPeriod,
  projectImpactsLoadingState,
  onCurrentViewModeChange,
  onEvaluationPeriodChange,
  onSelectComparisonSiteNature,
}: Props) => {
  if (projectImpactsLoadingState === "error") {
    return (
      <Alert
        description="Une erreur s'est produite lors du chargement des données, veuillez réessayer."
        severity="error"
        title="Impossible de charger la comparaison des impacts du projet"
        className="my-7"
      />
    );
  }

  if (projectImpactsLoadingState === "loading") {
    return <LoadingSpinner />;
  }
  return (
    <>
      <div className="flex justify-between items-end">
        <h2 className="mb-0">Comparer les impacts avec...</h2>
        <ImpactComparisonSelect
          baseSiteNature={relatedSiteNature}
          onSelectOption={onSelectComparisonSiteNature}
        />
      </div>

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
        <ImpactsComparisonResult
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
    </>
  );
};

export default ProjectImpactsUrbanSprawlImpactsComparisonView;

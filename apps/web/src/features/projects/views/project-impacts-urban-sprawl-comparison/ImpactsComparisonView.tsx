import Alert from "@codegouvfr/react-dsfr/Alert";
import { useState } from "react";
import { SiteNature } from "shared";

import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import { UrbanSprawlImpactsComparisonState } from "../../application/project-impacts-urban-sprawl-comparison/urbanSprawlComparison.reducer";
import { ViewMode } from "../../application/project-impacts/projectImpacts.reducer";
import ImpactComparisonSelect from "./ImpactComparisonSelect";
import ImpactsComparisonResult from "./ImpactsComparisonResult";
import UrbanSprawlImpactsComparisonIntroductionModal, {
  ONBOARDING_DIALOG_ID,
} from "./introduction/IntroModal";

type Props = {
  projectId: string;
  relatedSiteNature: SiteNature;
  projectImpactsLoadingState: "idle" | "success" | "error" | "loading";
  shouldDisplayOnBoarding: boolean;
  onCompleteOnBoarding: () => void;
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
  shouldDisplayOnBoarding,
  onCompleteOnBoarding,
  onCurrentViewModeChange,
  onEvaluationPeriodChange,
  onSelectComparisonSiteNature,
}: Props) => {
  const [showResults, setShowResults] = useState(!shouldDisplayOnBoarding);

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
          nativeSubmitButtonProps={
            shouldDisplayOnBoarding
              ? { "data-fr-opened": false, "aria-controls": ONBOARDING_DIALOG_ID }
              : undefined
          }
          onSubmit={(formData) => {
            onSelectComparisonSiteNature(formData.comparisonSiteNature);
            if (!shouldDisplayOnBoarding) {
              setShowResults(true);
            }
          }}
        />
        <UrbanSprawlImpactsComparisonIntroductionModal
          onFinalNext={() => {
            setShowResults(true);
            onCompleteOnBoarding();
          }}
          dataLoadingState={dataLoadingState}
          projectName={projectData?.name}
          projectType={projectData?.developmentPlan.type}
          baseSiteData={baseCase?.conversionSiteData}
          comparisonSiteData={comparisonCase?.conversionSiteData}
        />
      </div>

      {showResults && (
        <>
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
      )}
    </>
  );
};

export default ProjectImpactsUrbanSprawlImpactsComparisonView;

import Alert from "@codegouvfr/react-dsfr/Alert";
import { useEffect, useLayoutEffect } from "react";

import { UrbanSprawlImpactsComparisonState } from "@/features/projects/application/project-impacts-urban-sprawl-comparison/urbanSprawlComparison.reducer";
import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import Step1 from "./Step1";
import Step2 from "./Step2";

const STEPS = {
  1: "1-type-de-site-compares",
  2: "2-details-situations-compares",
};

type Props = {
  onFinalNext: () => void;
  onNextToStep: (step: string) => void;
  onBackToStep: (step: string) => void;
  routeStep?: string;
  dataLoadingState: UrbanSprawlImpactsComparisonState["dataLoadingState"];
  projectName?: string;
  baseSiteData?: Exclude<
    UrbanSprawlImpactsComparisonState["baseCase"],
    undefined
  >["conversionSiteData"];
  comparisonSiteData?: Exclude<
    UrbanSprawlImpactsComparisonState["baseCase"],
    undefined
  >["conversionSiteData"];
};

const DEFAULT_STEP = STEPS[1];

const parseRouteStep = (step?: string) =>
  step && Object.values(STEPS).includes(step) ? step : DEFAULT_STEP;

export default function UrbanSprawlImpactsComparisonIntroduction({
  onBackToStep,
  onNextToStep,
  onFinalNext,
  routeStep,
  projectName,
  dataLoadingState,

  baseSiteData,
  comparisonSiteData,
}: Props) {
  const currentStep = parseRouteStep(routeStep);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  useEffect(() => {
    if (routeStep !== currentStep) {
      onBackToStep(currentStep);
    }
  }, [currentStep, onBackToStep, routeStep]);

  return (
    <div className="fr-container my-8 md:my-20">
      <div className="md:w-3/4 mx-auto">
        {(() => {
          if (dataLoadingState === "error") {
            return (
              <div className="py-6">
                <HtmlTitle>{`Erreur - Introduction - Comparaison des impacts`}</HtmlTitle>
                <h1 className="text-sm uppercase font-normal mb-1">Comparaison des impacts</h1>
                <Alert
                  description="Une erreur s'est produite lors du chargement des données, veuillez réessayer."
                  severity="error"
                  title="Impossible de charger la comparaison des impacts du projet"
                  className="my-7"
                />
              </div>
            );
          } else if (dataLoadingState === "loading") {
            return (
              <>
                <HtmlTitle>{`Chargement... - Introduction - Comparaison des impacts`}</HtmlTitle>
                <LoadingSpinner />
              </>
            );
          } else if (dataLoadingState === "success") {
            switch (currentStep) {
              case STEPS[1]:
                return (
                  <>
                    <HtmlTitle>{`Caractéristiques du site fictif - Introduction - Comparaison des impacts`}</HtmlTitle>
                    <Step1
                      onNextClick={() => {
                        onNextToStep(STEPS[2]);
                      }}
                      projectName={projectName!}
                      baseSiteData={baseSiteData!}
                      comparisonSiteData={comparisonSiteData!}
                    />
                  </>
                );
              case STEPS[2]:
                return (
                  <>
                    <HtmlTitle>{`Détails des situations - Introduction - Comparaison des impacts`}</HtmlTitle>
                    <Step2
                      onNextClick={() => {
                        onFinalNext();
                      }}
                      onBackClick={() => {
                        onBackToStep(STEPS[1]);
                      }}
                      baseSiteData={baseSiteData!}
                      comparisonSiteData={comparisonSiteData!}
                    />
                  </>
                );
            }
          }
        })()}
      </div>
    </div>
  );
}

import Alert from "@codegouvfr/react-dsfr/Alert";
import { useEffect, useLayoutEffect } from "react";

import { UrbanSprawlImpactsComparisonState } from "@/features/projects/application/project-impacts-urban-sprawl-comparison/urbanSprawlComparison.reducer";
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
    <div className="fr-container tw-my-8 md:tw-my-20">
      <div className="md:tw-w-3/4 tw-mx-auto">
        {(() => {
          if (dataLoadingState === "error") {
            return (
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
            );
          } else if (dataLoadingState === "loading") {
            return <LoadingSpinner />;
          } else if (dataLoadingState === "success") {
            switch (currentStep) {
              case STEPS[1]:
                return (
                  <Step1
                    onNextClick={() => {
                      onNextToStep(STEPS[2]);
                    }}
                    projectName={projectName!}
                    baseSiteData={baseSiteData!}
                    comparisonSiteData={comparisonSiteData!}
                  />
                );
              case STEPS[2]:
                return (
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
                );
            }
          }
        })()}
      </div>
    </div>
  );
}

import Alert from "@codegouvfr/react-dsfr/Alert";
import { useState } from "react";
import { SiteImpactsDataView } from "shared";

import { ProjectImpactsState } from "@/features/projects/application/project-impacts/projectImpacts.reducer";
import DsfrDialogContent from "@/shared/views/components/Dialog/DsfrDialogContent";
import DsfrDialogFooter from "@/shared/views/components/Dialog/DsfrDialogFooter";
import DsfrDialogHeader from "@/shared/views/components/Dialog/DsfrDialogHeader";
import DsfrDialogTitle from "@/shared/views/components/Dialog/DsfrDialogTitle";
import DsfrDialogWrapper from "@/shared/views/components/Dialog/DsfrDialogWrapper";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import Step1 from "./IntroModalFirstStepContent";
import Step2 from "./IntroModalSecondStepContent";

type Props = {
  onFinalNext: () => void;
  dataLoadingState: ProjectImpactsState["dataLoadingState"]["urbanSprawlSimulation"];
  contextData: ProjectImpactsState["contextData"];
  comparisonSiteData?: SiteImpactsDataView;
};

export const ONBOARDING_DIALOG_ID = "fr-dialog-urban-sprawl-comparison-onboarding";

export default function UrbanSprawlImpactsComparisonIntroductionModal({
  onFinalNext,
  dataLoadingState,
  contextData,
  comparisonSiteData,
}: Props) {
  const [currentStep, setCurrentStep] = useState<0 | 1>(0);

  return (
    <DsfrDialogWrapper dialogId={ONBOARDING_DIALOG_ID} size="large">
      <DsfrDialogHeader />
      {(() => {
        if (dataLoadingState === "error") {
          return (
            <DsfrDialogContent>
              <DsfrDialogTitle>Comparaison des impacts</DsfrDialogTitle>
              <Alert
                description="Une erreur s'est produite lors du chargement des données, veuillez réessayer."
                severity="error"
                title="Impossible de charger la comparaison des impacts du projet"
                className="my-7"
              />
            </DsfrDialogContent>
          );
        } else if (dataLoadingState === "loading") {
          return (
            <DsfrDialogContent>
              <DsfrDialogTitle>Comparaison des impacts</DsfrDialogTitle>
              <LoadingSpinner />
            </DsfrDialogContent>
          );
        } else if (dataLoadingState === "success" && currentStep === 0) {
          return (
            <>
              <DsfrDialogContent>
                <Step1 contextData={contextData!} comparisonSiteData={comparisonSiteData!} />
              </DsfrDialogContent>
              <DsfrDialogFooter
                buttons={[
                  { priority: "secondary", closeModal: true, children: "Retour" },
                  {
                    priority: "primary",
                    onClick: () => {
                      setCurrentStep(1);
                    },
                    children: "Suivant",
                  },
                ]}
              />
            </>
          );
        } else if (dataLoadingState === "success" && currentStep === 1) {
          return (
            <>
              <DsfrDialogContent>
                <Step2
                  projectType={contextData?.projectDevelopmentPlan.type ?? "URBAN_PROJECT"}
                  baseSiteNature={contextData?.siteNature ?? "FRICHE"}
                  comparisonSiteNature={comparisonSiteData?.nature ?? "AGRICULTURAL_OPERATION"}
                />
              </DsfrDialogContent>
              <DsfrDialogFooter
                buttons={[
                  {
                    priority: "secondary",
                    onClick: () => {
                      setCurrentStep(0);
                    },
                    children: "Retour",
                  },
                  {
                    priority: "primary",
                    closeModal: true,
                    onClick: onFinalNext,
                    children: "Comparer les impacts",
                  },
                ]}
              />
            </>
          );
        } else {
          return (
            <DsfrDialogContent>
              <DsfrDialogTitle>Comparaison des impacts</DsfrDialogTitle>
            </DsfrDialogContent>
          );
        }
      })()}
    </DsfrDialogWrapper>
  );
}

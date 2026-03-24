// useSiteCreationWizardLayout.tsx
import { useMemo } from "react";

import { useAppSelector } from "@/app/hooks/store.hooks";
import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";
import SidebarLayout from "@/shared/views/layout/SidebarLayout/SidebarLayout";
import FormStepper from "@/shared/views/layout/WizardFormLayout/FormStepper";

import type { SiteCreationCustomStep, SiteCreationStep } from "../core/createSite.reducer";
import { selectSiteCreationWizardViewData } from "../core/selectors/createSite.selectors";
import { isUrbanZoneStepHandlerStep } from "../core/urban-zone/urbanZoneSteps";
import CreateModeSelectionForm from "./create-mode-selection";
import SiteCreationCustomStepContent from "./custom/StepContent";
import SiteCreationCustomStepper from "./custom/Stepper";
import SiteCreationExpressStepContent from "./demo";
import SiteCreationExpressStepper from "./demo/Stepper";
import UseMutabilityForm from "./friche/use-mutability";
import SiteCreationIntroduction from "./introduction";
import IsFricheForm from "./is-friche";
import NavigationBlockerDialog from "./navigation-blocker";
import SiteNatureForm from "./site-nature";
import UrbanZoneTypeForm from "./urban-zone-type";
import SiteCreationUrbanZoneStepContent from "./urban-zone/StepContent";
import UrbanZoneStepper from "./urban-zone/UrbanZoneStepper";
import { useSyncCreationStepWithRouteQuery } from "./useSyncCreationStepWithRouteQuery";

export const HTML_MAIN_TITLE = "Renseignement du site";

const STEP_CONFIG: Partial<Record<SiteCreationStep, { title: string; content: React.ReactNode }>> =
  {
    INTRODUCTION: { title: "Introduction", content: <SiteCreationIntroduction /> },
    IS_FRICHE: { title: "Type de site", content: <IsFricheForm /> },
    USE_MUTABILITY: { title: "Type d'évaluation", content: <UseMutabilityForm /> },
    SITE_NATURE: { title: "Catégorie du site", content: <SiteNatureForm /> },
    URBAN_ZONE_TYPE: { title: "Type de zone urbaine", content: <UrbanZoneTypeForm /> },
  };

export function useSiteCreationWizardLayout() {
  const { currentStep, isFriche, createMode } = useAppSelector(selectSiteCreationWizardViewData);

  return useMemo(() => {
    if (createMode === "express") {
      return {
        htmlTitle: HTML_MAIN_TITLE,
        sidebarChildren: <SiteCreationExpressStepper />,
        mainChildren: <SiteCreationExpressStepContent />,
      };
    }

    if (createMode === "custom") {
      if (isUrbanZoneStepHandlerStep(currentStep)) {
        return {
          htmlTitle: HTML_MAIN_TITLE,
          mainChildren: <SiteCreationUrbanZoneStepContent />,
          sidebarChildren: (
            <>
              <NavigationBlockerDialog />
              <UrbanZoneStepper step={currentStep} />
            </>
          ),
        };
      }

      const stepConfig = STEP_CONFIG[currentStep];
      if (stepConfig) {
        return {
          htmlTitle: `${stepConfig.title} - ${HTML_MAIN_TITLE}`,
          mainChildren: stepConfig.content,
          sidebarChildren: (
            <FormStepper currentStepIndex={0} steps={["Introduction"]} isDone={false} />
          ),
        };
      }

      return {
        htmlTitle: HTML_MAIN_TITLE,
        mainChildren: (
          <>
            <NavigationBlockerDialog />
            <SiteCreationCustomStepContent />
          </>
        ),
        sidebarChildren: (
          <SiteCreationCustomStepper
            isFriche={isFriche}
            step={currentStep as SiteCreationCustomStep}
          />
        ),
      };
    }

    return {
      htmlTitle: `Mode de création - ${HTML_MAIN_TITLE}`,
      mainChildren: <CreateModeSelectionForm />,
      sidebarChildren: <FormStepper currentStepIndex={0} steps={["Introduction"]} isDone={false} />,
    };
  }, [currentStep, createMode, isFriche]);
}

function SiteCreationWizard() {
  useSyncCreationStepWithRouteQuery();

  const { htmlTitle, mainChildren, sidebarChildren } = useSiteCreationWizardLayout();

  return (
    <>
      <HtmlTitle>{htmlTitle}</HtmlTitle>
      <SidebarLayout
        title="Renseignement du site"
        mainChildren={mainChildren}
        sidebarChildren={sidebarChildren}
      />
    </>
  );
}

export default SiteCreationWizard;

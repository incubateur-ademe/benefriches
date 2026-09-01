// useSiteCreationWizardLayout.tsx
import { useEffect, useMemo } from "react";
import { Route } from "type-route";

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { routes, useRoute } from "@/app/router";
import { selectCurrentUserEmail } from "@/features/onboarding/core/user.reducer";
import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";
import SidebarLayout from "@/shared/views/layout/SidebarLayout/SidebarLayout";
import FormStepper from "@/shared/views/layout/WizardFormLayout/FormStepper";

import type {
  SiteCreationCustomStep,
  SiteCreationState,
  SiteCreationStep,
} from "../core/createSite.reducer";
import { selectSiteCreationWizardViewData } from "../core/selectors/createSite.selectors";
import { siteCreationInitiated } from "../core/steps/introduction/introduction.actions";
import { isUrbanZoneStepHandlerStep } from "../core/urban-zone/urbanZoneSteps";
import CreateModeSelectionForm from "./create-mode-selection";
import CustomSiteCascadingUpdateDialog from "./custom/CustomSiteCascadingUpdateDialog";
import SiteCreationCustomStepContent from "./custom/StepContent";
import SiteCreationCustomStepper from "./custom/Stepper";
import SiteCreationExpressStepContent from "./demo";
import SiteCreationExpressStepper from "./demo/Stepper";
import UseMutabilityForm from "./friche/use-mutability";
import SiteCreationIntroduction from "./introduction";
import IsFricheForm from "./is-friche";
import NavigationBlockerDialog from "./navigation-blocker";
import { CustomSiteFormProvider } from "./site-form/CustomSiteFormProvider";
import { DemoSiteFormProvider } from "./site-form/DemoSiteFormProvider";
import { UrbanZoneSiteFormProvider } from "./site-form/UrbanZoneSiteFormProvider";
import SiteNatureForm from "./site-nature";
import UrbanZoneTypeForm from "./urban-zone-type";
import SiteCreationUrbanZoneStepContent from "./urban-zone/StepContent";
import UrbanZoneStepper from "./urban-zone/UrbanZoneStepper";
import { useSyncCreationStepWithRouteQuery } from "./useSyncCreationStepWithRouteQuery";

export const HTML_MAIN_TITLE = "Renseignement du site";

// Pre-engine steps only: INTRODUCTION/IS_FRICHE/USE_MUTABILITY/SITE_NATURE dispatch through
// `stepReverted` + the per-step `*Completed` actions (core/steps/introduction), not the custom
// wizard-form engine, so they render outside any form-context provider.
const STEP_CONFIG: Partial<Record<SiteCreationStep, { title: string; content: React.ReactNode }>> =
  {
    INTRODUCTION: { title: "Introduction", content: <SiteCreationIntroduction /> },
    IS_FRICHE: { title: "Type de site", content: <IsFricheForm /> },
    USE_MUTABILITY: { title: "Type d'évaluation", content: <UseMutabilityForm /> },
    SITE_NATURE: { title: "Catégorie du site", content: <SiteNatureForm /> },
  };

// URBAN_ZONE_TYPE is a real custom-flow engine step (it dispatches through `customFormActions`,
// see custom/customSteps.ts) that the wizard nonetheless renders with the same single-step
// stepper as the pre-engine steps above, ahead of the full custom step content. Deviation from
// the plan's file list, which grouped it with the 5 pre-engine steps: it needs
// `CustomSiteFormProvider`, the others don't.
const URBAN_ZONE_TYPE_STEP_TITLE = "Type de zone urbaine";

type UseSiteCreationWizardLayoutProps = {
  isFriche: boolean | undefined;
  currentStep: SiteCreationStep;
  createMode: SiteCreationState["createMode"];
};
export function useSiteCreationWizardLayout({
  currentStep,
  createMode,
  isFriche,
}: UseSiteCreationWizardLayoutProps) {
  return useMemo(() => {
    if (createMode === "express") {
      return {
        htmlTitle: HTML_MAIN_TITLE,
        sidebarChildren: (
          <DemoSiteFormProvider mode="create">
            <SiteCreationExpressStepper />
          </DemoSiteFormProvider>
        ),
        mainChildren: (
          <DemoSiteFormProvider mode="create">
            <SiteCreationExpressStepContent />
          </DemoSiteFormProvider>
        ),
      };
    }

    if (createMode === "custom") {
      if (isUrbanZoneStepHandlerStep(currentStep)) {
        return {
          htmlTitle: HTML_MAIN_TITLE,
          mainChildren: (
            <UrbanZoneSiteFormProvider mode="create">
              <SiteCreationUrbanZoneStepContent />
            </UrbanZoneSiteFormProvider>
          ),
          sidebarChildren: (
            <UrbanZoneSiteFormProvider mode="create">
              <NavigationBlockerDialog />
              <UrbanZoneStepper step={currentStep} />
            </UrbanZoneSiteFormProvider>
          ),
        };
      }

      if (currentStep === "URBAN_ZONE_TYPE") {
        return {
          htmlTitle: `${URBAN_ZONE_TYPE_STEP_TITLE} - ${HTML_MAIN_TITLE}`,
          mainChildren: (
            <CustomSiteFormProvider mode="create">
              <UrbanZoneTypeForm />
            </CustomSiteFormProvider>
          ),
          sidebarChildren: (
            <FormStepper currentStepIndex={0} steps={["Introduction"]} isDone={false} />
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
          <CustomSiteFormProvider mode="create">
            <NavigationBlockerDialog />
            <CustomSiteCascadingUpdateDialog />
            <SiteCreationCustomStepContent />
          </CustomSiteFormProvider>
        ),
        sidebarChildren: (
          <CustomSiteFormProvider mode="create">
            <SiteCreationCustomStepper
              isFriche={isFriche}
              step={currentStep as SiteCreationCustomStep}
            />
          </CustomSiteFormProvider>
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
  const dispatch = useAppDispatch();
  const { currentStep, isFriche, createMode } = useAppSelector(selectSiteCreationWizardViewData);
  const currentUserEmail = useAppSelector(selectCurrentUserEmail);

  useSyncCreationStepWithRouteQuery();

  const route = useRoute() as Route<typeof routes.createSite>;

  useEffect(() => {
    void dispatch(
      siteCreationInitiated({
        createMode: route.params.creationMode === "demo" ? "express" : route.params.creationMode,
        evaluationMode: route.params.evaluationMode,
      }),
    );
  }, [dispatch, route.params.creationMode, route.params.evaluationMode]);

  const { htmlTitle, mainChildren, sidebarChildren } = useSiteCreationWizardLayout({
    currentStep,
    isFriche,
    createMode,
  });

  return (
    <>
      <HtmlTitle>{htmlTitle}</HtmlTitle>
      <SidebarLayout
        title={createMode === "express" ? "Évaluation démo" : "Renseignement du site"}
        currentUserEmail={currentUserEmail}
        mainChildren={mainChildren}
        sidebarChildren={sidebarChildren}
      />
    </>
  );
}

export default SiteCreationWizard;

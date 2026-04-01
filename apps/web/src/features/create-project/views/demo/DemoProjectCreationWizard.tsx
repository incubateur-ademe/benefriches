import { lazy, Suspense, useEffect } from "react";

import { useAppSelector } from "@/app/hooks/store.hooks";
import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import SidebarLayout from "@/shared/views/layout/SidebarLayout/SidebarLayout";

import { selectDemoProjectCreationWizardViewData } from "../../core/demo/demoProject.selectors";
import { DemoProjectCreationStep } from "../../core/demo/demoSteps.ts";
import { HTML_MAIN_TITLE } from "../mainHtmlTitle";
import { useSyncCreationStepWithRouteQuery } from "../useSyncCreationStepWithRouteQuery";
import DemoProjectCreationStepper from "./DemoProjectCreationStepper";

const DemoProjectTemplateSelection = lazy(() => import("./template-selection"));

const DemoProjectSummary = lazy(() => import("./summary"));

const DemoProjectCreationResult = lazy(() => import("./creation-result"));

const HTML_FORM_MAIN_TITLE = `Démo - ${HTML_MAIN_TITLE}`;

export const DEMO_PROJECT_CREATION_STEP_QUERY_STRING_MAP = {
  DEMO_PROJECT_TEMPLATE_SELECTION: "template-demo",
  DEMO_PROJECT_SUMMARY: "recapitulatif-demo",
  DEMO_PROJECT_CREATION_RESULT: "fin",
} as const satisfies Record<DemoProjectCreationStep, string>;

function DemoProjectCreationWizard() {
  const { currentStep } = useAppSelector(selectDemoProjectCreationWizardViewData);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  useSyncCreationStepWithRouteQuery(DEMO_PROJECT_CREATION_STEP_QUERY_STRING_MAP[currentStep]);

  return (
    <SidebarLayout
      title="Projet démo"
      sidebarChildren={<DemoProjectCreationStepper />}
      mainChildren={
        <Suspense fallback={<LoadingSpinner />}>
          {(() => {
            switch (currentStep) {
              case "DEMO_PROJECT_TEMPLATE_SELECTION":
                return (
                  <>
                    <HtmlTitle>{`Modèle - Usages - ${HTML_FORM_MAIN_TITLE}`}</HtmlTitle>
                    <DemoProjectTemplateSelection />
                  </>
                );
              case "DEMO_PROJECT_SUMMARY":
                return (
                  <>
                    <HtmlTitle>{`Récapitulatif - ${HTML_FORM_MAIN_TITLE}`}</HtmlTitle>
                    <DemoProjectSummary />
                  </>
                );
              case "DEMO_PROJECT_CREATION_RESULT":
                return (
                  <>
                    <HtmlTitle>{`Résultat - ${HTML_FORM_MAIN_TITLE}`}</HtmlTitle>
                    <DemoProjectCreationResult />
                  </>
                );
            }
          })()}
        </Suspense>
      }
    />
  );
}

export default DemoProjectCreationWizard;

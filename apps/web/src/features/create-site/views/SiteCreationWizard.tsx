import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import SidebarLayout from "@/shared/views/layout/SidebarLayout/SidebarLayout";
import FormStepper from "@/shared/views/layout/WizardFormLayout/FormStepper";

import {
  selectCurrentStep,
  SiteCreationCustomStep,
  SiteCreationExpressStep,
  SiteCreationState,
  SiteCreationStep,
} from "../core/createSite.reducer";
import CreateModeSelectionForm from "./create-mode-selection";
import SiteCreationCustomStepContent from "./custom/StepContent";
import SiteCreationCustomStepper from "./custom/Stepper";
import SiteCreationExpressStepContent from "./express/StepContent";
import SiteCreationExpressStepper from "./express/Stepper";
import SiteCreationIntroduction from "./introduction";
import IsFricheForm from "./is-friche";
import SiteNatureForm from "./site-nature";
import StepRevertConfirmationModal from "./step-revert-confirmation-modal";
import { useSyncCreationStepWithRouteQuery } from "./useSyncCreationStepWithRouteQuery";

export const HTML_MAIN_TITLE = "Renseignement du site";

const getMainChildren = (
  currentStep: SiteCreationStep,
  createMode: SiteCreationState["createMode"],
) => {
  switch (currentStep) {
    case "INTRODUCTION":
      return (
        <>
          <HtmlTitle>{`Introduction - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <SiteCreationIntroduction />
        </>
      );
    case "IS_FRICHE":
      return (
        <>
          <HtmlTitle>{`Type de site - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <IsFricheForm />
        </>
      );
    case "SITE_NATURE":
      return (
        <>
          <HtmlTitle>{`Catégorie du site - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <SiteNatureForm />
        </>
      );
    case "CREATE_MODE_SELECTION":
      return (
        <>
          <HtmlTitle>{`Mode de création - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <CreateModeSelectionForm />
        </>
      );
    default:
      switch (createMode) {
        case "express":
          return <SiteCreationExpressStepContent />;
        case "custom":
          return <SiteCreationCustomStepContent />;
        case undefined:
      }
  }
};

function SiteCreationWizard() {
  const currentStep = useAppSelector(selectCurrentStep);
  const { isFriche } = useAppSelector((state) => state.siteCreation.siteData);
  const createMode = useAppSelector((state) => state.siteCreation.createMode);

  useSyncCreationStepWithRouteQuery();

  return (
    <>
      <StepRevertConfirmationModal />
      <SidebarLayout
        mainChildren={getMainChildren(currentStep, createMode)}
        title="Renseignement du site"
        sidebarChildren={(() => {
          switch (createMode) {
            case "express":
              return <SiteCreationExpressStepper step={currentStep as SiteCreationExpressStep} />;
            case "custom":
              return (
                <SiteCreationCustomStepper
                  isFriche={isFriche}
                  step={currentStep as SiteCreationCustomStep}
                />
              );
            default:
              return <FormStepper currentStepIndex={0} steps={["Introduction"]} isDone={false} />;
          }
        })()}
      />
    </>
  );
}

export default SiteCreationWizard;

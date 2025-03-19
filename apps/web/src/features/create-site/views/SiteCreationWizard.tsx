import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";
import SidebarLayout from "@/shared/views/layout/SidebarLayout/SidebarLayout";
import FormStepper from "@/shared/views/layout/WizardFormLayout/FormStepper";

import { siteCreationInitiated } from "../core/actions/introduction.actions";
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

const getMainChildren = (
  currentStep: SiteCreationStep,
  createMode: SiteCreationState["createMode"],
) => {
  switch (currentStep) {
    case "INTRODUCTION":
      return <SiteCreationIntroduction />;
    case "IS_FRICHE":
      return <IsFricheForm />;
    case "SITE_NATURE":
      return <SiteNatureForm />;
    case "CREATE_MODE_SELECTION":
      return <CreateModeSelectionForm />;
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
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(siteCreationInitiated());
  }, [dispatch]);

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

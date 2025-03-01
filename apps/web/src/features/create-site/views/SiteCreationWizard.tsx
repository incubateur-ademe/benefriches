import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";
import SidebarLayout from "@/shared/views/layout/SidebarLayout/SidebarLayout";

import {
  siteCreationInitiated,
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
import { useSyncCreationStepWithRouteQuery } from "./useSyncCreationStepWithRouteQuery";

const getMainChildren = (
  currentStep: SiteCreationStep,
  createMode: SiteCreationState["createMode"],
) => {
  switch (currentStep) {
    case "INTRODUCTION":
      return <SiteCreationIntroduction />;
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
            return null;
        }
      })()}
    />
  );
}

export default SiteCreationWizard;

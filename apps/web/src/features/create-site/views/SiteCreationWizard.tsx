import { useState } from "react";
import {
  selectCurrentStep,
  SiteCreationCustomStep,
  SiteCreationExpressStep,
} from "../application/createSite.reducer";
import SiteCreationCustomStepContent from "./custom/StepContent";
import SiteCreationCustomStepper from "./custom/Stepper";
import SiteCreationExpressStepContent from "./express/StepContent";
import SiteCreationExpressStepper from "./express/Stepper";
import CreateModeSelectionForm from "./create-mode-selection";

import AboutFormsModal from "@/shared/app-settings/views/AboutFormsModal";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import SidebarLayout from "@/shared/views/layout/SidebarLayout/SidebarLayout";

function SiteCreationWizard() {
  const currentStep = useAppSelector(selectCurrentStep);
  const { isFriche } = useAppSelector((state) => state.siteCreation.siteData);
  const createMode = useAppSelector((state) => state.siteCreation.createMode);

  const [isOpen, setOpen] = useState(true);

  const isExpress = createMode === "express";

  return (
    <SidebarLayout
      mainChildren={
        currentStep === "CREATE_MODE_SELECTION" ? (
          <CreateModeSelectionForm />
        ) : isExpress ? (
          <SiteCreationExpressStepContent />
        ) : (
          <>
            <AboutFormsModal />
            <SiteCreationCustomStepContent />
          </>
        )
      }
      title="Renseignement du site"
      isOpen={isOpen}
      toggleIsOpen={() => {
        setOpen((current) => !current);
      }}
      sidebarChildren={
        currentStep === "CREATE_MODE_SELECTION" ? null : isExpress ? (
          <SiteCreationExpressStepper
            step={currentStep as SiteCreationExpressStep}
            isExtended={isOpen}
          />
        ) : (
          <SiteCreationCustomStepper
            isFriche={isFriche}
            step={currentStep as SiteCreationCustomStep}
            isExtended={isOpen}
          />
        )
      }
    />
  );
}

export default SiteCreationWizard;

import { useEffect, useState } from "react";
import {
  resetState,
  selectCurrentStep,
  SiteCreationCustomStep,
  SiteCreationExpressStep,
  SiteCreationState,
  SiteCreationStep,
} from "../application/createSite.reducer";
import SiteCreationCustomStepContent from "./custom/StepContent";
import SiteCreationCustomStepper from "./custom/Stepper";
import SiteCreationExpressStepContent from "./express/StepContent";
import SiteCreationExpressStepper from "./express/Stepper";
import CreateModeSelectionForm from "./create-mode-selection";
import SiteCreationIntroduction from "./introduction";
import { useSyncCreationStepWithRouteQuery } from "./useSyncCreationStepWithRouteQuery";

import AboutFormsModal from "@/shared/app-settings/views/AboutFormsModal";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";
import SidebarLayout from "@/shared/views/layout/SidebarLayout/SidebarLayout";

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
          return (
            <>
              <AboutFormsModal />
              <SiteCreationCustomStepContent />
            </>
          );
        case undefined:
      }
  }
};

function SiteCreationWizard() {
  const currentStep = useAppSelector(selectCurrentStep);
  const { isFriche } = useAppSelector((state) => state.siteCreation.siteData);
  const createMode = useAppSelector((state) => state.siteCreation.createMode);
  const dispatch = useAppDispatch();

  const [isOpen, setOpen] = useState(true);

  useEffect(() => {
    dispatch(resetState());
  }, [dispatch]);

  useSyncCreationStepWithRouteQuery();

  return (
    <SidebarLayout
      mainChildren={getMainChildren(currentStep, createMode)}
      title="Renseignement du site"
      isOpen={isOpen}
      toggleIsOpen={() => {
        setOpen((current) => !current);
      }}
      sidebarChildren={(() => {
        switch (createMode) {
          case "express":
            return (
              <SiteCreationExpressStepper
                step={currentStep as SiteCreationExpressStep}
                isExtended={isOpen}
              />
            );
          case "custom":
            return (
              <SiteCreationCustomStepper
                isFriche={isFriche}
                step={currentStep as SiteCreationCustomStep}
                isExtended={isOpen}
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

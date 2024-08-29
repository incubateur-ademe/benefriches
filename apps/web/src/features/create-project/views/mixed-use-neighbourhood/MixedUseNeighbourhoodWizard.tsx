import { useState } from "react";
import { selectCurrentStep } from "../../application/mixed-use-neighbourhood/mixedUseNeighbourhoodProject.selectors";
import CreateModeSelectionForm from "./create-mode-selection";
import MixedUseNeighbourhoodCreationResult from "./creation-result";
import MixedUseNeighbourhoodCreationStepper from "./Stepper";

import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import SidebarLayout from "@/shared/views/layout/SidebarLayout/SidebarLayout";

function MixedUseNeighbourhoodWizard() {
  const currentStep = useAppSelector(selectCurrentStep);
  const [isOpen, setOpen] = useState(true);

  const getStepComponent = () => {
    switch (currentStep) {
      case "CREATE_MODE_SELECTION":
        return <CreateModeSelectionForm />;
      case "CREATION_RESULT":
        return <MixedUseNeighbourhoodCreationResult />;
    }
  };

  return (
    <SidebarLayout
      mainChildren={getStepComponent()}
      title="Renseignement du projet"
      isOpen={isOpen}
      toggleIsOpen={() => {
        setOpen((current) => !current);
      }}
      sidebarChildren={
        <MixedUseNeighbourhoodCreationStepper step={currentStep} isExtended={isOpen} />
      }
    />
  );
}

export default MixedUseNeighbourhoodWizard;

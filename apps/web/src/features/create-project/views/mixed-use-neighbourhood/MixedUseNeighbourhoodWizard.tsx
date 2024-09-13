import { useState } from "react";
import { useEffect } from "react";
import { MixedUseNeighbourhoodCreationStep } from "../../application/mixed-use-neighbourhood/mixedUseNeighbourhoodProject.reducer";
import { selectCurrentStep } from "../../application/mixed-use-neighbourhood/mixedUseNeighbourhoodProject.selectors";
import CreateModeSelectionForm from "./create-mode-selection";
import MixedUseNeighbourhoodCreationResult from "./creation-result";
import MixedUseNeighbourhoodCreationStepper from "./Stepper";

import { routes, useRoute } from "@/app/views/router";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import SidebarLayout from "@/shared/views/layout/SidebarLayout/SidebarLayout";

const PROJECT_CREATION_STEP_QUERY_STRING_MAP = {
  CREATE_MODE_SELECTION: "mode-creation",
  CREATION_RESULT: "fin",
} as const satisfies Record<MixedUseNeighbourhoodCreationStep, string>;

const useSyncCreationStepWithRouteQuery = () => {
  const currentStep = useAppSelector(selectCurrentStep);
  const currentRoute = useRoute();

  useEffect(() => {
    if (currentRoute.name !== routes.createProject.name) return;

    routes
      .createProject({
        siteId: currentRoute.params.siteId,
        etape: PROJECT_CREATION_STEP_QUERY_STRING_MAP[currentStep],
      })
      .push();
    // we don't care about other parameters
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, currentRoute.name]);
};

function MixedUseNeighbourhoodWizard() {
  const currentStep = useAppSelector(selectCurrentStep);
  const [isOpen, setOpen] = useState(true);
  useSyncCreationStepWithRouteQuery();

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

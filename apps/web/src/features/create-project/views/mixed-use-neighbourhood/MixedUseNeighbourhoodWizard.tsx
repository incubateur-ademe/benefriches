import { useState } from "react";
import { useEffect } from "react";
import {
  MixedUseNeighbourhoodExpressCreationStep,
  UrbanProjectCreationStep,
} from "../../application/mixed-use-neighbourhood/mixedUseNeighbourhoodProject.reducer";
import {
  selectCreateMode,
  selectCurrentStep,
} from "../../application/mixed-use-neighbourhood/mixedUseNeighbourhoodProject.selectors";
import CreateModeSelectionForm from "./create-mode-selection";
import UrbanProjectExpressCreationStepWizard from "./express-forms";
import MixedUseNeighbourhoodCreationStepper from "./Stepper";

import { routes, useRoute } from "@/app/views/router";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import SidebarLayout from "@/shared/views/layout/SidebarLayout/SidebarLayout";

const PROJECT_CREATION_STEP_QUERY_STRING_MAP = {
  CREATE_MODE_SELECTION: "mode-creation",
  CREATION_RESULT: "fin",
} as const satisfies Record<UrbanProjectCreationStep, string>;

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
  const createMode = useAppSelector(selectCreateMode);
  const [isOpen, setOpen] = useState(true);
  useSyncCreationStepWithRouteQuery();

  switch (createMode) {
    case undefined:
      return (
        <SidebarLayout
          mainChildren={<CreateModeSelectionForm />}
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
    case "express":
      return (
        <UrbanProjectExpressCreationStepWizard
          currentStep={currentStep as MixedUseNeighbourhoodExpressCreationStep}
        />
      );
  }
}

export default MixedUseNeighbourhoodWizard;

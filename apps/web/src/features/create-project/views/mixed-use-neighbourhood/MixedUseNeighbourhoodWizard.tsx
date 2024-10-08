import { useState } from "react";
import { useEffect } from "react";
import {
  MixedUseNeighbourhoodExpressCreationStep,
  UrbanProjectCreationStep,
  UrbanProjectCustomCreationStep,
} from "../../application/mixed-use-neighbourhood/mixedUseNeighbourhoodProject.reducer";
import {
  selectCreateMode,
  selectCurrentStep,
} from "../../application/mixed-use-neighbourhood/mixedUseNeighbourhoodProject.selectors";
import CreateModeSelectionForm from "./create-mode-selection";
import UrbanProjectCustomCreationStepWizard from "./custom-forms";
import UrbanProjectExpressCreationStepWizard from "./express-forms";
import MixedUseNeighbourhoodCreationStepper from "./Stepper";

import { routes, useRoute } from "@/app/views/router";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import SidebarLayout from "@/shared/views/layout/SidebarLayout/SidebarLayout";

const PROJECT_CREATION_STEP_QUERY_STRING_MAP = {
  CREATE_MODE_SELECTION: "mode-creation",
  SPACES_CATEGORIES_INTRODUCTION: "espaces-introduction",
  SPACES_CATEGORIES_SELECTION: "espaces-selection",
  SPACES_CATEGORIES_SURFACE_AREA: "espaces-surfaces",
  CREATION_RESULT: "fin",
} as const satisfies Record<UrbanProjectCreationStep, string>;

const useSyncCreationStepWithRouteQuery = () => {
  const currentStep = useAppSelector(selectCurrentStep);
  const currentRoute = useRoute();

  useEffect(() => {
    if (
      currentRoute.name !== routes.createProject.name ||
      !(currentStep in PROJECT_CREATION_STEP_QUERY_STRING_MAP)
    )
      return;

    const stepQueryParamValue = PROJECT_CREATION_STEP_QUERY_STRING_MAP[currentStep];
    routes
      .createProject({
        siteId: currentRoute.params.siteId,
        etape: stepQueryParamValue,
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
    case "custom":
      return (
        <UrbanProjectCustomCreationStepWizard
          currentStep={currentStep as UrbanProjectCustomCreationStep}
        />
      );
  }
}

export default MixedUseNeighbourhoodWizard;

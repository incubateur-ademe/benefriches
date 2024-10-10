import { useState } from "react";
import { useEffect } from "react";

import { routes, useRoute } from "@/app/views/router";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import SidebarLayout from "@/shared/views/layout/SidebarLayout/SidebarLayout";

import {
  UrbanProjectCreationStep,
  UrbanProjectCustomCreationStep,
  UrbanProjectExpressCreationStep,
} from "../../application/urban-project/urbanProject.reducer";
import {
  selectCreateMode,
  selectCurrentStep,
} from "../../application/urban-project/urbanProject.selectors";
import UrbanProjectCreationStepper from "./Stepper";
import CreateModeSelectionForm from "./create-mode-selection";
import UrbanProjectCustomCreationStepWizard from "./custom-forms";
import UrbanProjectExpressCreationStepWizard from "./express-forms";

const PROJECT_CREATION_STEP_QUERY_STRING_MAP = {
  CREATE_MODE_SELECTION: "mode-creation",
  SPACES_CATEGORIES_INTRODUCTION: "espaces-introduction",
  SPACES_CATEGORIES_SELECTION: "espaces-selection",
  SPACES_CATEGORIES_SURFACE_AREA: "espaces-surfaces",
  SPACES_DEVELOPMENT_PLAN_INTRODUCTION: "introduction-amenagement-des-espaces",
  GREEN_SPACES_INTRODUCTION: "espaces-verts-introduction",
  GREEN_SPACES_SELECTION: "espaces-verts-selection",
  GREEN_SPACES_SURFACE_AREA_DISTRIBUTION: "espaces-verts-surfaces",
  LIVING_AND_ACTIVITY_SPACES_INTRODUCTION: "espaces-de-vie-et-activites-introduction",
  LIVING_AND_ACTIVITY_SPACES_SELECTION: "espaces-de-vie-et-activites-selection",
  LIVING_AND_ACTIVITY_SPACES_DISTRIBUTION: "espaces-de-vie-et-activites-surfaces",
  PUBLIC_SPACES_INTRODUCTION: "espaces-publics-introduction",
  PUBLIC_SPACES_SELECTION: "espaces-publics-selection",
  PUBLIC_SPACES_DISTRIBUTION: "espaces-publics-surfaces",
  SPACES_DEVELOPMENT_PLAN_SUMMARY: "recapitulatif-amenagement-des-espaces",
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

function UrbanProjectCreationWizard() {
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
          sidebarChildren={<UrbanProjectCreationStepper step={currentStep} isExtended={isOpen} />}
        />
      );
    case "express":
      return (
        <UrbanProjectExpressCreationStepWizard
          currentStep={currentStep as UrbanProjectExpressCreationStep}
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

export default UrbanProjectCreationWizard;

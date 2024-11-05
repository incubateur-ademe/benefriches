import { useState } from "react";

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
import { useSyncCreationStepWithRouteQuery } from "../useSyncCreationStepWithRouteQuery";
import UrbanProjectCreationStepper from "./Stepper";
import CreateModeSelectionForm from "./create-mode-selection";
import UrbanProjectCustomCreationStepWizard from "./custom-forms";
import UrbanProjectExpressCreationStepWizard from "./express-forms";

const PROJECT_CREATION_STEP_QUERY_STRING_MAP = {
  CREATE_MODE_SELECTION: "mode-creation",
  EXPRESS_CATEGORY_SELECTION: "typologie-de-projet-express",
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
  SPACES_SOILS_SUMMARY: "recapitulatif-sols-amenagement-des-espaces",
  SOILS_CARBON_SUMMARY: "recapitulatif-stockage-carbone-sols",
  SOILS_DECONTAMINATION_INTRODUCTION: "introduction-depollution-sols",
  SOILS_DECONTAMINATION_SELECTION: "selection-depollution-sols",
  SOILS_DECONTAMINATION_SURFACE_AREA: "surface-depollution-sols",
  BUILDINGS_INTRODUCTION: "introduction-batiments",
  BUILDINGS_FLOOR_SURFACE_AREA: "surface-plancher-batiments",
  BUILDINGS_USE_INTRODUCTION: "introduction-usage-batiments",
  BUILDINGS_USE_SELECTION: "selection-usage-batiments",
  BUILDINGS_USE_SURFACE_AREA: "surface-usage-batiments",
  BUILDINGS_ECONOMIC_ACTIVITY_SELECTION: "selection-lieux-activites-economique",
  BUILDINGS_ECONOMIC_ACTIVITY_SURFACE_AREA: "surface-lieux-activites-economique",
  BUILDINGS_EQUIPMENT_INTRODUCTION: "introduction-equipements",
  BUILDINGS_EQUIPMENT_SELECTION: "selection-equipements",
  STAKEHOLDERS_INTRODUCTION: "acteurs-introduction",
  STAKEHOLDERS_PROJECT_DEVELOPER: "acteurs-amenageur",
  STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER: "acteurs-maitre-ouvrage-remise-en-etat",
  FINAL_SUMMARY: "recapitulatif-projet-urbain",
  CREATION_RESULT: "fin",
} as const satisfies Record<UrbanProjectCreationStep, string>;

function UrbanProjectCreationWizard() {
  const currentStep = useAppSelector(selectCurrentStep);
  const createMode = useAppSelector(selectCreateMode);
  const [isOpen, setOpen] = useState(true);

  useSyncCreationStepWithRouteQuery(PROJECT_CREATION_STEP_QUERY_STRING_MAP[currentStep]);

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

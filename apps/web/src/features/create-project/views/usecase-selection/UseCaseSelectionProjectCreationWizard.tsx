import { useAppSelector } from "@/app/hooks/store.hooks";

import { UseCaseSelectionStep } from "../../core/usecase-selection/useCaseSelection.reducer";
import { selectUseCaseSelectionWizardViewData } from "../../core/usecase-selection/useCaseSelection.selectors";
import { useSyncCreationStepWithRouteQuery } from "../useSyncCreationStepWithRouteQuery";
import CreateModeSelectionForm from "./create-mode-selection";
import ProjectPhaseFormContainer from "./project-phase";
import ProjectTypesFormContainer from "./project-types";
import ProjectRenewableEnergyTypesFormContainer from "./renewable-energy-types";

const PROJECT_CREATION_STEP_QUERY_STRING_MAP = {
  USE_CASE_SELECTION_PROJECT_PHASE: "avancement-du-projet",
  USE_CASE_SELECTION_CREATION_MODE: "mode-de-creation",
  USE_CASE_SELECTION_PROJECT_TYPE_SELECTION: "type-de-projet",
  USE_CASE_SELECTION_RENEWABLE_ENERGY_TYPE: "type-d-energie-renouvelable",
} as const satisfies Record<UseCaseSelectionStep, string>;

const UseCaseSelectionProjectCreationWizard = () => {
  const { currentStep } = useAppSelector(selectUseCaseSelectionWizardViewData);

  useSyncCreationStepWithRouteQuery(PROJECT_CREATION_STEP_QUERY_STRING_MAP[currentStep]);

  switch (currentStep) {
    case "USE_CASE_SELECTION_PROJECT_PHASE":
      return <ProjectPhaseFormContainer />;
    case "USE_CASE_SELECTION_PROJECT_TYPE_SELECTION":
      return <ProjectTypesFormContainer />;
    case "USE_CASE_SELECTION_RENEWABLE_ENERGY_TYPE":
      return <ProjectRenewableEnergyTypesFormContainer />;
    case "USE_CASE_SELECTION_CREATION_MODE":
      return <CreateModeSelectionForm />;
  }
};

export default UseCaseSelectionProjectCreationWizard;

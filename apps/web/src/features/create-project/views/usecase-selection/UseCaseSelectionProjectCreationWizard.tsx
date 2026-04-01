import { useAppSelector } from "@/app/hooks/store.hooks";
import SidebarLayout from "@/shared/views/layout/SidebarLayout/SidebarLayout";

import { UseCaseSelectionStep } from "../../core/usecase-selection/useCaseSelection.reducer";
import { selectUseCaseSelectionWizardViewData } from "../../core/usecase-selection/useCaseSelection.selectors";
import { useSyncCreationStepWithRouteQuery } from "../useSyncCreationStepWithRouteQuery";
import UseCaseSelectionStepper from "./UseCaseSelectionStepper";
import CreateModeSelectionForm from "./create-mode-selection";
import ProjectTypesFormContainer from "./project-types";
import ProjectRenewableEnergyTypesFormContainer from "./renewable-energy-types";

const PROJECT_CREATION_STEP_QUERY_STRING_MAP = {
  USE_CASE_SELECTION_CREATION_MODE: "mode-de-creation",
  USE_CASE_SELECTION_PROJECT_TYPE_SELECTION: "type-de-projet",
  USE_CASE_SELECTION_RENEWABLE_ENERGY_TYPE: "type-d-energie-renouvelable",
} as const satisfies Record<UseCaseSelectionStep, string>;

const UseCaseSelectionProjectCreationWizard = () => {
  const { currentStep } = useAppSelector(selectUseCaseSelectionWizardViewData);

  useSyncCreationStepWithRouteQuery(PROJECT_CREATION_STEP_QUERY_STRING_MAP[currentStep]);

  return (
    <SidebarLayout
      mainChildren={(() => {
        switch (currentStep) {
          case "USE_CASE_SELECTION_PROJECT_TYPE_SELECTION":
            return <ProjectTypesFormContainer />;
          case "USE_CASE_SELECTION_RENEWABLE_ENERGY_TYPE":
            return <ProjectRenewableEnergyTypesFormContainer />;
          case "USE_CASE_SELECTION_CREATION_MODE":
            return <CreateModeSelectionForm />;
        }
      })()}
      title="Renseignement du projet"
      sidebarChildren={<UseCaseSelectionStepper />}
    />
  );
};

export default UseCaseSelectionProjectCreationWizard;

import {
  UrbanProjectCreationStep,
  UrbanProjectCustomCreationStep,
  UrbanProjectExpressCreationStep,
} from "@/features/create-project/core/urban-project/creationSteps";
import { selectCreateMode } from "@/features/create-project/core/urban-project/selectors/urbanProject.selectors";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import SidebarLayout from "@/shared/views/layout/SidebarLayout/SidebarLayout";

import UrbanProjectCreationStepper from "./Stepper";
import CreateModeSelectionForm from "./create-mode-selection";
import UrbanProjectCustomCreationStepWizard from "./custom-forms";
import UrbanProjectExpressCreationStepWizard from "./express-forms";

type Props = {
  currentStep: UrbanProjectCreationStep;
};

function UrbanProjectCreationWizard({ currentStep }: Props) {
  const createMode = useAppSelector(selectCreateMode);

  switch (createMode) {
    case undefined:
      return (
        <SidebarLayout
          mainChildren={<CreateModeSelectionForm />}
          title="Renseignement du projet"
          sidebarChildren={<UrbanProjectCreationStepper step={currentStep} />}
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

import {
  isAnwersStep,
  isInformationalStep,
} from "@/features/create-project/core/urban-project-event-sourcing/urbanProjectSteps";
import { UrbanProjectCustomCreationStep } from "@/features/create-project/core/urban-project/creationSteps";
import SidebarLayout from "@/shared/views/layout/SidebarLayout/SidebarLayout";

import UrbanProjectCustomSteps from "../stepper/Stepper";
import AnswerStepsWizard from "./AnswerStepWizard";
import InformationalStepWizard from "./InformationalStepWizard";

const UrbanProjectCustomCreationStepWizardBeta = ({
  currentStep,
}: {
  currentStep: UrbanProjectCustomCreationStep;
}) => {
  return (
    <SidebarLayout
      title="Renseignement du projet (Bêta)"
      sidebarChildren={<UrbanProjectCustomSteps step={currentStep} />}
      mainChildren={(() => {
        if (isAnwersStep(currentStep)) {
          return <AnswerStepsWizard currentStep={currentStep} />;
        }

        if (isInformationalStep(currentStep)) {
          return <InformationalStepWizard currentStep={currentStep} />;
        }
      })()}
    />
  );
};

export default UrbanProjectCustomCreationStepWizardBeta;

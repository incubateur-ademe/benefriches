import { selectCurrentStep } from "@/features/create-project/core/urban-project-event-sourcing/urbanProject.selectors";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";

import UrbanProjectCustomCreationStepWizardBeta from "./content-wizards/StepWizardBeta";

export default function UrbanProjectCustomCreationStepWizardBetaContainer() {
  const currentStep = useAppSelector(selectCurrentStep);

  return <UrbanProjectCustomCreationStepWizardBeta currentStep={currentStep} />;
}

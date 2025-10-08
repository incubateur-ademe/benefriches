import { selectCurrentStep } from "@/features/create-project/core/urban-project-beta/urbanProject.selectors";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";

import UrbanProjectCustomCreationStepWizard from "./UrbanProjectCustomCreationStepWizard";

export default function UrbanProjectCustomCreationStepWizardContainer() {
  const currentStep = useAppSelector(selectCurrentStep);

  return <UrbanProjectCustomCreationStepWizard currentStep={currentStep} />;
}

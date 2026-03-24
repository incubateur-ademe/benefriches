import { useAppSelector } from "@/app/hooks/store.hooks";
import FormStepper from "@/shared/views/layout/WizardFormLayout/FormStepper";

import { selectDemoUseCaseContentWizardViewData } from "../../core/demo/demo.selectors";
import {
  DEMO_STEP_GROUP_IDS,
  DEMO_STEP_GROUP_LABELS,
  DEMO_STEP_TO_GROUP,
} from "../../core/demo/demoStepperConfig";

const stepCategories = DEMO_STEP_GROUP_IDS.map((id) => DEMO_STEP_GROUP_LABELS[id]);

function DemoSiteCreationStepper() {
  const { currentStep } = useAppSelector(selectDemoUseCaseContentWizardViewData);

  const { groupId } = DEMO_STEP_TO_GROUP[currentStep];
  const currentStepIndex = DEMO_STEP_GROUP_IDS.indexOf(groupId);
  const isDone = currentStep === "DEMO_CREATION_RESULT";

  return <FormStepper currentStepIndex={currentStepIndex} steps={stepCategories} isDone={isDone} />;
}

export default DemoSiteCreationStepper;

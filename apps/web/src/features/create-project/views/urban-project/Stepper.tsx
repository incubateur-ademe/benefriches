import FormStepper from "@/shared/views/layout/WizardFormLayout/FormStepper";

import { UrbanProjectCreationStep } from "../../application/urban-project/urbanProject.reducer";

const stepCategories = ["Type de projet", "Mode de création"] as const;

type Props = {
  step: UrbanProjectCreationStep;
  isExtended?: boolean;
};

function UrbanProjectCreationStepper({ step, isExtended }: Props) {
  const currentStepCategory = "Mode de création";
  const currentStepIndex = stepCategories.findIndex((step) => step === currentStepCategory);
  const isDone = step === "CREATION_RESULT";

  return (
    <FormStepper
      currentStepIndex={currentStepIndex}
      steps={stepCategories.map((step) => step)}
      isExtended={isExtended}
      isDone={isDone}
    />
  );
}

export default UrbanProjectCreationStepper;

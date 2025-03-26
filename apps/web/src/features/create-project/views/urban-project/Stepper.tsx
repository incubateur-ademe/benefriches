import FormStepper from "@/shared/views/layout/WizardFormLayout/FormStepper";

import { UrbanProjectCreationStep } from "../../core/urban-project/creationSteps";

const stepCategories = ["Type de projet", "Mode de création"] as const;

type Props = {
  step: UrbanProjectCreationStep;
};

function UrbanProjectCreationStepper({ step }: Props) {
  const currentStepCategory = "Mode de création";
  const currentStepIndex = stepCategories.findIndex((step) => step === currentStepCategory);
  const isDone = step === "URBAN_PROJECT_CREATION_RESULT";

  return (
    <FormStepper
      currentStepIndex={currentStepIndex}
      steps={stepCategories.map((step) => step)}
      isDone={isDone}
    />
  );
}

export default UrbanProjectCreationStepper;

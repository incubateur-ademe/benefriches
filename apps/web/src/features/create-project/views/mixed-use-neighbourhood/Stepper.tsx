import { UrbanProjectCreationStep } from "../../application/mixed-use-neighbourhood/mixedUseNeighbourhoodProject.reducer";

import FormStepper from "@/shared/views/layout/WizardFormLayout/FormStepper";

const stepCategories = ["Type de projet", "Mode de création"] as const;

type Props = {
  step: UrbanProjectCreationStep;
  isExtended?: boolean;
};

function MixedUseNeighbourhoodCreationStepper({ step, isExtended }: Props) {
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

export default MixedUseNeighbourhoodCreationStepper;

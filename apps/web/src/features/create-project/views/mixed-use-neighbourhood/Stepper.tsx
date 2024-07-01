import { MixedUseNeighbourhoodCreationStep } from "../../application/mixed-use-neighbourhood/mixedUseNeighbourhoodProject.reducer";

import FormStepper from "@/shared/views/layout/WizardFormLayout/FormStepper";

const stepCategories = ["Type de projet", "Mode de création", "Récapitulatif"] as const;

type StepCategory = (typeof stepCategories)[number];

const getCategoryForStep = (step: MixedUseNeighbourhoodCreationStep): StepCategory => {
  switch (step) {
    case "CREATE_MODE_SELECTION":
      return "Mode de création";
    case "CREATION_RESULT":
      return "Récapitulatif";
  }
};

type Props = {
  step: MixedUseNeighbourhoodCreationStep;
  isExtended?: boolean;
};

function MixedUseNeighbourhoodCreationStepper({ step, isExtended }: Props) {
  const currentStepCategory = getCategoryForStep(step);
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

import FormStepper from "@/shared/views/layout/WizardFormLayout/FormStepper";

import { RenewableEnergyCreationStep } from "../../core/renewable-energy/creationSteps";

const stepCategories = ["Type de projet", "Mode de création"] as const;

type Props = {
  step: RenewableEnergyCreationStep;
};

function PhotovoltaicPowerStationStepper({ step }: Props) {
  const currentStepCategory = "Mode de création";
  const currentStepIndex = stepCategories.findIndex((step) => step === currentStepCategory);
  const isDone = step === "RENEWABLE_ENERGY_CREATION_RESULT";

  return (
    <FormStepper
      currentStepIndex={currentStepIndex}
      steps={stepCategories.map((step) => step)}
      isDone={isDone}
    />
  );
}

export default PhotovoltaicPowerStationStepper;

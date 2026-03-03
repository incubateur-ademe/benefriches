import FormStepper from "@/shared/views/layout/WizardFormLayout/FormStepper";

import type { AllRenewableEnergyStep } from "../../core/renewable-energy/renewableEnergySteps";

const stepCategories = ["Type de projet", "Mode de création"] as const;

type Props = {
  step: AllRenewableEnergyStep;
};

function PhotovoltaicPowerStationStepper({ step }: Props) {
  const currentStepCategory = "Mode de création";
  const currentStepIndex = stepCategories.findIndex((step) => step === currentStepCategory);
  const isDone = step === "RENEWABLE_ENERGY_CREATION_RESULT";

  return (
    <FormStepper currentStepIndex={currentStepIndex} steps={[...stepCategories]} isDone={isDone} />
  );
}

export default PhotovoltaicPowerStationStepper;

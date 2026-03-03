import FormStepper from "@/shared/views/layout/WizardFormLayout/FormStepper";

import type { RenewableEnergyCreationStep } from "../../../core/renewable-energy/renewableEnergySteps";
import {
  RENEWABLE_ENERGY_STEP_GROUP_IDS,
  RENEWABLE_ENERGY_STEP_GROUP_LABELS,
  RENEWABLE_ENERGY_STEP_TO_GROUP,
} from "../../../core/renewable-energy/step-handlers/renewableEnergyStepperConfig";

const PRE_CUSTOM_LABELS = ["Type de projet", "Mode de création"] as const;

const stepCategories = [
  ...PRE_CUSTOM_LABELS,
  ...RENEWABLE_ENERGY_STEP_GROUP_IDS.map((id) => RENEWABLE_ENERGY_STEP_GROUP_LABELS[id]),
];

type Props = {
  step: RenewableEnergyCreationStep;
};

function PhotovoltaicPowerStationStepper({ step }: Props) {
  const { groupId } = RENEWABLE_ENERGY_STEP_TO_GROUP[step];
  const currentStepIndex =
    RENEWABLE_ENERGY_STEP_GROUP_IDS.indexOf(groupId) + PRE_CUSTOM_LABELS.length;
  const isDone = step === "RENEWABLE_ENERGY_CREATION_RESULT";

  return <FormStepper currentStepIndex={currentStepIndex} steps={stepCategories} isDone={isDone} />;
}

export default PhotovoltaicPowerStationStepper;

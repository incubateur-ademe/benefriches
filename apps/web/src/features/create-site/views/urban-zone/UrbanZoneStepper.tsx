import FormStepper from "@/shared/views/layout/WizardFormLayout/FormStepper";

import {
  URBAN_ZONE_STEP_GROUP_IDS,
  URBAN_ZONE_STEP_GROUP_LABELS,
  URBAN_ZONE_STEP_TO_GROUP,
} from "../../core/urban-zone/step-handlers/urbanZoneStepperConfig";
import type { UrbanZoneSiteCreationStep } from "../../core/urban-zone/urbanZoneSteps";

const PRE_STEP_LABELS = ["Type de site", "Adresse"] as const;

const stepCategories = [
  ...PRE_STEP_LABELS,
  ...URBAN_ZONE_STEP_GROUP_IDS.map((id) => URBAN_ZONE_STEP_GROUP_LABELS[id]),
];

type Props = {
  step: UrbanZoneSiteCreationStep;
};

function UrbanZoneStepper({ step }: Props) {
  const { groupId } = URBAN_ZONE_STEP_TO_GROUP[step];
  const currentStepIndex = URBAN_ZONE_STEP_GROUP_IDS.indexOf(groupId) + PRE_STEP_LABELS.length;
  const isDone = step === "URBAN_ZONE_CREATION_RESULT";

  return <FormStepper currentStepIndex={currentStepIndex} steps={stepCategories} isDone={isDone} />;
}

export default UrbanZoneStepper;

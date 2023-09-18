import { Stepper } from "@codegouvfr/react-dsfr/Stepper";

import { FricheCreationStep } from "@/store/features/fricheCreation";
import { CreationStep } from "@/store/features/siteCreation";

const steps = [
  { stepNumber: 1, title: "Type de site" },
  { stepNumber: 2, title: "Adresse" },
  { stepNumber: 3, title: "Espaces" },
  { stepNumber: 4, title: "Gestion du site" },
  { stepNumber: 5, title: "Dénomination" },
];

const getCurrentStep = (step: CreationStep | FricheCreationStep) => {
  switch (step) {
    case CreationStep.TYPE_STEP:
      return steps[0];
    case CreationStep.ADDRESS_STEP:
      return steps[1];
    case FricheCreationStep.LAST_ACTIVITY_STEP:
    case FricheCreationStep.SPACES_STEP:
    case FricheCreationStep.SPACES_SURFACE_AREA_STEP:
      return steps[2];
  }
};

type Props = {
  step: CreationStep | FricheCreationStep;
};

function FricheCreationStepper({ step }: Props) {
  const currentStep = getCurrentStep(step);

  if (!currentStep) return null;

  return (
    <Stepper
      title={currentStep.title}
      currentStep={currentStep.stepNumber}
      stepCount={steps.length}
    />
  );
}

export default FricheCreationStepper;

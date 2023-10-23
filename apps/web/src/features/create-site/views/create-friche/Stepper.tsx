import { Stepper } from "@codegouvfr/react-dsfr/Stepper";
import { FricheCreationStep } from "../../application/createFriche.reducer";

import { CreationStep } from "@/features/create-site/application/createSite.reducer";

const steps = [
  { stepNumber: 1, title: "Type de site" },
  { stepNumber: 2, title: "Adresse" },
  { stepNumber: 3, title: "Sols" },
  { stepNumber: 4, title: "Pollution" },
  { stepNumber: 5, title: "Gestion du site" },
  { stepNumber: 6, title: "Dénomination" },
];

const getCurrentStep = (step: CreationStep | FricheCreationStep) => {
  switch (step) {
    case CreationStep.TYPE_STEP:
      return steps[0];
    case CreationStep.ADDRESS_STEP:
      return steps[1];
    case FricheCreationStep.SOIL_INTRODUCTION:
    case FricheCreationStep.SURFACE_AREA:
    case FricheCreationStep.SOILS:
      return steps[2];
    case FricheCreationStep.NAMING_STEP:
    case FricheCreationStep.LAST_ACTIVITY_STEP:
      return steps[5];
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

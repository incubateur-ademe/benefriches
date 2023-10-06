import { Stepper } from "@codegouvfr/react-dsfr/Stepper";
import { NaturalAreaCreationStep } from "../../application/createNaturalArea.reducers";

import { CreationStep } from "@/features/create-site/application/createSite.reducers";

const steps = [
  { stepNumber: 1, title: "Type de site" },
  { stepNumber: 2, title: "Adresse" },
  { stepNumber: 3, title: "Espaces" },
  { stepNumber: 4, title: "Gestion du site" },
  { stepNumber: 5, title: "Dénomination" },
];

const getCurrentStep = (step: CreationStep | NaturalAreaCreationStep) => {
  switch (step) {
    case NaturalAreaCreationStep.SPACES_STEP:
    case NaturalAreaCreationStep.SPACES_SURFACE_AREA_STEP:
      return steps[2];
    case NaturalAreaCreationStep.OWNER_STEP:
    case NaturalAreaCreationStep.OPERATION_STEP:
    case NaturalAreaCreationStep.FULL_TIME_JOBS_INVOLVED_STEP:
    case NaturalAreaCreationStep.YEARLY_EXPENSES_STEP:
      return steps[3];
    case NaturalAreaCreationStep.NAMING_STEP:
      return steps[4];
  }
};

type Props = {
  step: NaturalAreaCreationStep;
};

function NaturalAreaCreationStepper({ step }: Props) {
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

export default NaturalAreaCreationStepper;

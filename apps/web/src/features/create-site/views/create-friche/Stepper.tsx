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
    case FricheCreationStep.SOILS_SURFACE_AREAS:
    case FricheCreationStep.SOILS_SUMMARY:
    case FricheCreationStep.SOILS_CARBON_STORAGE:
      return steps[2];
    case FricheCreationStep.SOIL_CONTAMINATION:
      return steps[3];
    case FricheCreationStep.MANAGEMENT_INTRODUCTION:
    case FricheCreationStep.OWNER:
    case FricheCreationStep.TENANT:
    case FricheCreationStep.RECENT_ACCIDENTS:
    case FricheCreationStep.FULL_TIME_JOBS_INVOLVED:
      return steps[4];
    case FricheCreationStep.NAMING_STEP:
    case FricheCreationStep.LAST_ACTIVITY_STEP:
    case FricheCreationStep.CREATION_CONFIRMATION:
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

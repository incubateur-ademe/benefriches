import { Stepper } from "@codegouvfr/react-dsfr/Stepper";

import { ProjectCreationStep } from "@/features/create-project/application/createProject.reducer";

const steps = ["Type de projet", "Dénomination"] as const;

const getCurrentStep = (step: ProjectCreationStep): string => {
  switch (step) {
    case ProjectCreationStep.PROJECT_TYPES:
    case ProjectCreationStep.RENEWABLE_ENERGY_TYPES:
      return steps[0];
    case ProjectCreationStep.CREATION_CONFIRMATION:
      return "Dénomination";
  }
};

type Props = {
  step: ProjectCreationStep;
};

function ProjectCreationStepper({ step }: Props) {
  const currentStep = getCurrentStep(step);

  if (!currentStep) return null;

  return (
    <Stepper
      title={currentStep}
      currentStep={steps.findIndex((step) => step === currentStep) + 1}
      stepCount={steps.length}
    />
  );
}

export default ProjectCreationStepper;

import { Stepper } from "@codegouvfr/react-dsfr/Stepper";

import { ProjectCreationStep } from "@/features/create-project/application/createProject.reducer";

const stepCategories = [
  "Type de projet",
  "Panneaux photovoltaïques",
  "Aménagement des sols",
  "Acteurs",
  "Dénomination",
] as const;

type StepCategory = (typeof stepCategories)[number];

const getCategoryForStep = (step: ProjectCreationStep): StepCategory => {
  switch (step) {
    case ProjectCreationStep.PROJECT_TYPES:
    case ProjectCreationStep.RENEWABLE_ENERGY_TYPES:
      return "Type de projet";
    case ProjectCreationStep.STAKEHOLDERS_INTRODUCTION:
    case ProjectCreationStep.STAKEHOLDERS_FUTURE_OPERATOR:
    case ProjectCreationStep.STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER:
    case ProjectCreationStep.STAKEHOLDERS_REINSTATEMENT_FULL_TIME_JOBS:
    case ProjectCreationStep.STAKEHOLDERS_OPERATIONS_FULL_TIMES_JOBS:
    case ProjectCreationStep.STAKEHOLDERS_FUTURE_OWNERSHIP_CHANGE:
    case ProjectCreationStep.STAKEHOLDERS_FUTURE_OWNER:
      return "Acteurs";
    case ProjectCreationStep.CREATION_CONFIRMATION:
      return "Dénomination";
  }
};

type Props = {
  step: ProjectCreationStep;
};

function ProjectCreationStepper({ step }: Props) {
  const currentStepCategory = getCategoryForStep(step);

  if (!currentStepCategory) return null;

  return (
    <Stepper
      title={currentStepCategory}
      currentStep={
        stepCategories.findIndex(
          (stepCategory) => stepCategory === currentStepCategory,
        ) + 1
      }
      stepCount={stepCategories.length}
    />
  );
}

export default ProjectCreationStepper;

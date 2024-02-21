import { Stepper } from "@codegouvfr/react-dsfr/Stepper";

import { ProjectCreationStep } from "@/features/create-project/application/createProject.reducer";

const stepCategories = [
  "Type de projet",
  "Photovoltaïque",
  "Aménagement des sols",
  "Acteurs",
  "Coûts et recettes",
  "Calendrier",
  "Dénomination",
] as const;

type StepCategory = (typeof stepCategories)[number];

const getCategoryForStep = (step: ProjectCreationStep): StepCategory => {
  switch (step) {
    case ProjectCreationStep.PROJECT_TYPES:
    case ProjectCreationStep.RENEWABLE_ENERGY_TYPES:
      return "Type de projet";
    case ProjectCreationStep.PHOTOVOLTAIC_KEY_PARAMETER:
    case ProjectCreationStep.PHOTOVOLTAIC_POWER:
    case ProjectCreationStep.PHOTOVOLTAIC_SURFACE:
    case ProjectCreationStep.PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION:
    case ProjectCreationStep.PHOTOVOLTAIC_CONTRACT_DURATION:
      return "Photovoltaïque";
    case ProjectCreationStep.SOILS_SURFACE_AREAS:
    case ProjectCreationStep.SOILS_SUMMARY:
    case ProjectCreationStep.SOILS_CARBON_STORAGE:
      return "Aménagement des sols";
    case ProjectCreationStep.STAKEHOLDERS_INTRODUCTION:
    case ProjectCreationStep.STAKEHOLDERS_FUTURE_OPERATOR:
    case ProjectCreationStep.STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER:
    case ProjectCreationStep.STAKEHOLDERS_RECONVERSION_FULL_TIME_JOBS:
    case ProjectCreationStep.STAKEHOLDERS_OPERATIONS_FULL_TIMES_JOBS:
    case ProjectCreationStep.STAKEHOLDERS_FUTURE_OWNERSHIP_CHANGE:
    case ProjectCreationStep.STAKEHOLDERS_FUTURE_OWNER:
    case ProjectCreationStep.STAKEHOLDERS_HAS_REAL_ESTATE_TRANSACTION:
    case ProjectCreationStep.STAKEHOLDERS_FUTURE_SITE_OWNER:
      return "Acteurs";
    case ProjectCreationStep.COSTS_INTRODUCTION:
    case ProjectCreationStep.COSTS_REINSTATEMENT:
    case ProjectCreationStep.COSTS_PHOTOVOLTAIC_PANELS_INSTALLATION:
    case ProjectCreationStep.COSTS_PROJECTED_YEARLY_COSTS:
    case ProjectCreationStep.REVENUE_INTRODUCTION:
    case ProjectCreationStep.REVENUE_PROJECTED_YEARLY_REVENUE:
    case ProjectCreationStep.REVENUE_FINANCIAL_ASSISTANCE:
      return "Coûts et recettes";
    case ProjectCreationStep.SCHEDULE_INTRODUCTION:
    case ProjectCreationStep.SCHEDULE_PROJECTION:
      return "Calendrier";
    case ProjectCreationStep.NAMING:
    case ProjectCreationStep.CREATION_CONFIRMATION:
      return "Dénomination";
  }
};

type Props = {
  step: ProjectCreationStep;
};

function ProjectCreationStepper({ step }: Props) {
  const currentStepCategory = getCategoryForStep(step);

  return (
    <Stepper
      title={currentStepCategory}
      currentStep={
        stepCategories.findIndex((stepCategory) => stepCategory === currentStepCategory) + 1
      }
      stepCount={stepCategories.length}
    />
  );
}

export default ProjectCreationStepper;

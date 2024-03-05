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
    case "PROJECT_TYPES":
    case "RENEWABLE_ENERGY_TYPES":
      return "Type de projet";
    case "PHOTOVOLTAIC_KEY_PARAMETER":
    case "PHOTOVOLTAIC_POWER":
    case "PHOTOVOLTAIC_SURFACE":
    case "PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION":
    case "PHOTOVOLTAIC_CONTRACT_DURATION":
      return "Photovoltaïque";
    case "SOILS_SURFACE_AREAS":
    case "SOILS_SUMMARY":
    case "SOILS_CARBON_STORAGE":
      return "Aménagement des sols";
    case "STAKEHOLDERS_INTRODUCTION":
    case "STAKEHOLDERS_FUTURE_OPERATOR":
    case "STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER":
    case "STAKEHOLDERS_RECONVERSION_FULL_TIME_JOBS":
    case "STAKEHOLDERS_OPERATIONS_FULL_TIMES_JOBS":
    case "STAKEHOLDERS_FUTURE_SITE_OWNER":
    case "STAKEHOLDERS_HAS_REAL_ESTATE_TRANSACTION":
      return "Acteurs";
    case "COSTS_INTRODUCTION":
    case "COSTS_REAL_ESTATE_TRANSACTION_AMOUNT":
    case "COSTS_REINSTATEMENT":
    case "COSTS_PHOTOVOLTAIC_PANELS_INSTALLATION":
    case "COSTS_PROJECTED_YEARLY_COSTS":
    case "REVENUE_INTRODUCTION":
    case "REVENUE_PROJECTED_YEARLY_REVENUE":
    case "REVENUE_FINANCIAL_ASSISTANCE":
      return "Coûts et recettes";
    case "SCHEDULE_INTRODUCTION":
    case "SCHEDULE_PROJECTION":
      return "Calendrier";
    case "NAMING":
    case "CREATION_CONFIRMATION":
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

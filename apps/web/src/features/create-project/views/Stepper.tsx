import { fr } from "@codegouvfr/react-dsfr";
import { Stepper } from "@codegouvfr/react-dsfr/Stepper";

import { ProjectCreationStep } from "@/features/create-project/application/createProject.reducer";

const stepCategories = [
  "Type de projet",
  "Paramètres du projet",
  "Transformation des sols",
  "Acteurs",
  "Coûts et recettes",
  "Emploi",
  "Calendrier et avancement",
  "Dénomination",
  "Récapitulatif",
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
      return "Paramètres du projet";
    case "SOILS_TRANSFORMATION_INTRODUCTION":
    case "NON_SUITABLE_SOILS_NOTICE":
    case "NON_SUITABLE_SOILS_SELECTION":
    case "NON_SUITABLE_SOILS_SURFACE":
    case "SOILS_TRANSFORMATION_PROJECT_SELECTION":
    case "SOILS_TRANSFORMATION_CUSTOM_SOILS_SELECTION":
    case "SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION":
    case "SOILS_SUMMARY":
    case "SOILS_CARBON_STORAGE":
      return "Transformation des sols";
    case "STAKEHOLDERS_INTRODUCTION":
    case "STAKEHOLDERS_PROJECT_DEVELOPER":
    case "STAKEHOLDERS_FUTURE_OPERATOR":
    case "STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER":
    case "STAKEHOLDERS_FUTURE_SITE_OWNER":
    case "STAKEHOLDERS_HAS_REAL_ESTATE_TRANSACTION":
      return "Acteurs";
    case "RECONVERSION_FULL_TIME_JOBS":
    case "OPERATIONS_FULL_TIMES_JOBS":
      return "Emploi";
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
    case "PROJECT_PHASE":
      return "Calendrier et avancement";
    case "NAMING":
      return "Dénomination";
    case "CREATION_CONFIRMATION":
    case "FINAL_SUMMARY":
      return "Récapitulatif";
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
      className={fr.cx("fr-mb-7w")}
    />
  );
}

export default ProjectCreationStepper;

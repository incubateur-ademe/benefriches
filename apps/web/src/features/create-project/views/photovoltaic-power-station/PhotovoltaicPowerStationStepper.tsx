import FormStepper from "@/shared/views/layout/WizardFormLayout/FormStepper";

import { RenewableEnergyCreationStep } from "../../core/renewable-energy/creationSteps";

const stepCategories = [
  "Type de projet",
  "Paramètres du projet",
  "Transformation des sols",
  "Acteurs",
  "Dépenses et recettes",
  "Calendrier et avancement",
  "Dénomination",
  "Récapitulatif",
] as const;

type StepCategory = (typeof stepCategories)[number];

const getCategoryForStep = (step: RenewableEnergyCreationStep): StepCategory => {
  switch (step) {
    case "RENEWABLE_ENERGY_TYPES":
    case "RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER":
    case "RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER":
    case "RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE":
    case "RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION":
    case "RENEWABLE_ENERGY_PHOTOVOLTAIC_CONTRACT_DURATION":
      return "Paramètres du projet";
    case "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_INTRODUCTION":
    case "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION":
    case "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SURFACE_AREA":
    case "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_INTRODUCTION":
    case "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_NOTICE":
    case "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SELECTION":
    case "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SURFACE":
    case "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION":
    case "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SOILS_SELECTION":
    case "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION":
    case "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CLIMATE_AND_BIODIVERSITY_IMPACT_NOTICE":
    case "RENEWABLE_ENERGY_SOILS_SUMMARY":
    case "RENEWABLE_ENERGY_SOILS_CARBON_STORAGE":
      return "Transformation des sols";
    case "RENEWABLE_ENERGY_STAKEHOLDERS_INTRODUCTION":
    case "RENEWABLE_ENERGY_STAKEHOLDERS_PROJECT_DEVELOPER":
    case "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_OPERATOR":
    case "RENEWABLE_ENERGY_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER":
    case "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_SITE_OWNER":
    case "RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE":
      return "Acteurs";
    case "RENEWABLE_ENERGY_EXPENSES_INTRODUCTION":
    case "RENEWABLE_ENERGY_EXPENSES_SITE_PURCHASE_AMOUNTS":
    case "RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT":
    case "RENEWABLE_ENERGY_EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION":
    case "RENEWABLE_ENERGY_EXPENSES_PROJECTED_YEARLY_EXPENSES":
    case "RENEWABLE_ENERGY_REVENUE_INTRODUCTION":
    case "RENEWABLE_ENERGY_REVENUE_PROJECTED_YEARLY_REVENUE":
    case "RENEWABLE_ENERGY_REVENUE_FINANCIAL_ASSISTANCE":
      return "Dépenses et recettes";
    case "RENEWABLE_ENERGY_SCHEDULE_INTRODUCTION":
    case "RENEWABLE_ENERGY_SCHEDULE_PROJECTION":
    case "RENEWABLE_ENERGY_PROJECT_PHASE":
      return "Calendrier et avancement";
    case "RENEWABLE_ENERGY_NAMING":
      return "Dénomination";
    case "RENEWABLE_ENERGY_CREATION_RESULT":
    case "RENEWABLE_ENERGY_FINAL_SUMMARY":
      return "Récapitulatif";
  }
};

type Props = {
  step: RenewableEnergyCreationStep;
};

function PhotovoltaicPowerStationStepper({ step }: Props) {
  const currentStepCategory = getCategoryForStep(step);
  const currentStepIndex = stepCategories.findIndex((step) => step === currentStepCategory);
  const isDone = step === "RENEWABLE_ENERGY_CREATION_RESULT";

  return (
    <FormStepper
      currentStepIndex={currentStepIndex}
      steps={stepCategories.map((step) => step)}
      isDone={isDone}
    />
  );
}

export default PhotovoltaicPowerStationStepper;

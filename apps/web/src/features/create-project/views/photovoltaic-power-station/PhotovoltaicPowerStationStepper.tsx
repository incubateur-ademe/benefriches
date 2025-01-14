import { PhotovoltaicProjectCreationStep } from "@/features/create-project/core/renewable-energy/renewableEnergy.reducer";
import FormStepper from "@/shared/views/layout/WizardFormLayout/FormStepper";

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

const getCategoryForStep = (step: PhotovoltaicProjectCreationStep): StepCategory => {
  switch (step) {
    case "RENEWABLE_ENERGY_TYPES":
    case "PHOTOVOLTAIC_KEY_PARAMETER":
    case "PHOTOVOLTAIC_POWER":
    case "PHOTOVOLTAIC_SURFACE":
    case "PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION":
    case "PHOTOVOLTAIC_CONTRACT_DURATION":
      return "Paramètres du projet";
    case "SOILS_DECONTAMINATION_INTRODUCTION":
    case "SOILS_DECONTAMINATION_SELECTION":
    case "SOILS_DECONTAMINATION_SURFACE_AREA":
    case "SOILS_TRANSFORMATION_INTRODUCTION":
    case "NON_SUITABLE_SOILS_NOTICE":
    case "NON_SUITABLE_SOILS_SELECTION":
    case "NON_SUITABLE_SOILS_SURFACE":
    case "SOILS_TRANSFORMATION_PROJECT_SELECTION":
    case "SOILS_TRANSFORMATION_CUSTOM_SOILS_SELECTION":
    case "SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION":
    case "SOILS_TRANSFORMATION_CLIMATE_AND_BIODIVERSITY_IMPACT_NOTICE":
    case "SOILS_SUMMARY":
    case "SOILS_CARBON_STORAGE":
      return "Transformation des sols";
    case "STAKEHOLDERS_INTRODUCTION":
    case "STAKEHOLDERS_PROJECT_DEVELOPER":
    case "STAKEHOLDERS_FUTURE_OPERATOR":
    case "STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER":
    case "STAKEHOLDERS_FUTURE_SITE_OWNER":
    case "STAKEHOLDERS_SITE_PURCHASE":
      return "Acteurs";
    case "EXPENSES_INTRODUCTION":
    case "EXPENSES_SITE_PURCHASE_AMOUNTS":
    case "EXPENSES_REINSTATEMENT":
    case "EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION":
    case "EXPENSES_PROJECTED_YEARLY_EXPENSES":
    case "REVENUE_INTRODUCTION":
    case "REVENUE_PROJECTED_YEARLY_REVENUE":
    case "REVENUE_FINANCIAL_ASSISTANCE":
      return "Dépenses et recettes";
    case "SCHEDULE_INTRODUCTION":
    case "SCHEDULE_PROJECTION":
    case "PROJECT_PHASE":
      return "Calendrier et avancement";
    case "NAMING":
      return "Dénomination";
    case "CREATION_RESULT":
    case "FINAL_SUMMARY":
      return "Récapitulatif";
  }
};

type Props = {
  step: PhotovoltaicProjectCreationStep;
};

function PhotovoltaicPowerStationStepper({ step }: Props) {
  const currentStepCategory = getCategoryForStep(step);
  const currentStepIndex = stepCategories.findIndex((step) => step === currentStepCategory);
  const isDone = step === "CREATION_RESULT";

  return (
    <FormStepper
      currentStepIndex={currentStepIndex}
      steps={stepCategories.map((step) => step)}
      isDone={isDone}
    />
  );
}

export default PhotovoltaicPowerStationStepper;

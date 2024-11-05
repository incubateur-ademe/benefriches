import { UrbanProjectCustomCreationStep } from "@/features/create-project/application/urban-project/urbanProject.reducer";
import FormStepper from "@/shared/views/layout/WizardFormLayout/FormStepper";

const stepCategories = [
  "Type de projet",
  "Mode de création",
  "Espaces",
  "Aménagement des espaces",
  "Dépollution des sols",
  "Bâtiments",
  "Acteurs",
  "Cession foncière",
  "Dépenses et recettes",
  "Calendrier et avancement",
  "Dénomination",
  "Récapitulatif",
] as const;

type StepCategory = (typeof stepCategories)[number];

const getCategoryForStep = (step: UrbanProjectCustomCreationStep): StepCategory => {
  switch (step) {
    case "SPACES_CATEGORIES_INTRODUCTION":
    case "SPACES_CATEGORIES_SELECTION":
    case "SPACES_CATEGORIES_SURFACE_AREA":
      return "Espaces";
    case "SPACES_DEVELOPMENT_PLAN_INTRODUCTION":
    case "GREEN_SPACES_INTRODUCTION":
    case "GREEN_SPACES_SELECTION":
    case "GREEN_SPACES_SURFACE_AREA_DISTRIBUTION":
    case "LIVING_AND_ACTIVITY_SPACES_INTRODUCTION":
    case "LIVING_AND_ACTIVITY_SPACES_SELECTION":
    case "LIVING_AND_ACTIVITY_SPACES_DISTRIBUTION":
    case "PUBLIC_SPACES_INTRODUCTION":
    case "PUBLIC_SPACES_SELECTION":
    case "PUBLIC_SPACES_DISTRIBUTION":
    case "SPACES_SOILS_SUMMARY":
    case "SOILS_CARBON_SUMMARY":
      return "Aménagement des espaces";
    case "SOILS_DECONTAMINATION_INTRODUCTION":
    case "SOILS_DECONTAMINATION_SELECTION":
    case "SOILS_DECONTAMINATION_SURFACE_AREA":
      return "Dépollution des sols";
    case "BUILDINGS_INTRODUCTION":
    case "BUILDINGS_FLOOR_SURFACE_AREA":
    case "BUILDINGS_USE_INTRODUCTION":
    case "BUILDINGS_USE_SELECTION":
    case "BUILDINGS_USE_SURFACE_AREA":
    case "BUILDINGS_ECONOMIC_ACTIVITY_SELECTION":
    case "BUILDINGS_EQUIPMENT_INTRODUCTION":
    case "BUILDINGS_EQUIPMENT_SELECTION":
    case "BUILDINGS_ECONOMIC_ACTIVITY_SURFACE_AREA":
      return "Bâtiments";
    case "STAKEHOLDERS_INTRODUCTION":
    case "STAKEHOLDERS_PROJECT_DEVELOPER":
    case "STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER":
      return "Acteurs";
    case "EXPENSES_INSTALLATION":
    case "EXPENSES_INTRODUCTION":
    case "EXPENSES_PROJECTED_YEARLY_EXPENSES":
    case "EXPENSES_REINSTATEMENT":
    case "EXPENSES_SITE_PURCHASE_AMOUNTS":
    case "REVENUE_FINANCIAL_ASSISTANCE":
    case "REVENUE_INTRODUCTION":
    case "REVENUE_PROJECTED_YEARLY_REVENUE":
      return "Dépenses et recettes";
    case "FINAL_SUMMARY":
      return "Récapitulatif";
  }
};

type Props = {
  step: UrbanProjectCustomCreationStep;
  isExtended?: boolean;
};

function UrbanProjectCustomSteps({ step, isExtended }: Props) {
  const currentStepCategory = getCategoryForStep(step);
  const currentStepIndex = stepCategories.findIndex((step) => step === currentStepCategory);

  return (
    <FormStepper
      currentStepIndex={currentStepIndex}
      steps={stepCategories.map((step) => step)}
      isExtended={isExtended}
      isDone={false}
    />
  );
}

export default UrbanProjectCustomSteps;

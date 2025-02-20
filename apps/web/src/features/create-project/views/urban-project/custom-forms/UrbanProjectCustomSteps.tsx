import { UrbanProjectCustomCreationStep } from "@/features/create-project/core/urban-project/creationSteps";
import { hasBuildings } from "@/features/create-project/core/urban-project/urbanProject.reducer";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import FormStepper from "@/shared/views/layout/WizardFormLayout/FormStepper";

const STEP_CATEGORIES = [
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

type StepCategory = (typeof STEP_CATEGORIES)[number];

const getCategoryForStep = (step: UrbanProjectCustomCreationStep): StepCategory => {
  switch (step) {
    case "SPACES_CATEGORIES_INTRODUCTION":
    case "SPACES_CATEGORIES_SELECTION":
    case "SPACES_CATEGORIES_SURFACE_AREA":
      return "Espaces";
    case "SPACES_DEVELOPMENT_PLAN_INTRODUCTION":
    case "GREEN_SPACES_INTRODUCTION":
    case "GREEN_SPACES_SURFACE_AREA_DISTRIBUTION":
    case "LIVING_AND_ACTIVITY_SPACES_INTRODUCTION":
    case "LIVING_AND_ACTIVITY_SPACES_DISTRIBUTION":
    case "PUBLIC_SPACES_INTRODUCTION":
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
    case "BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION":
    case "BUILDINGS_EQUIPMENT_INTRODUCTION":
    case "BUILDINGS_EQUIPMENT_SELECTION":
      return "Bâtiments";
    case "STAKEHOLDERS_INTRODUCTION":
    case "STAKEHOLDERS_PROJECT_DEVELOPER":
    case "STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER":
      return "Acteurs";
    case "SITE_RESALE_INTRODUCTION":
    case "SITE_RESALE_SELECTION":
    case "BUILDINGS_RESALE_SELECTION":
      return "Cession foncière";
    case "EXPENSES_INTRODUCTION":
    case "EXPENSES_SITE_PURCHASE_AMOUNTS":
    case "EXPENSES_REINSTATEMENT":
    case "EXPENSES_INSTALLATION":
    case "EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES":
    case "REVENUE_FINANCIAL_ASSISTANCE":
    case "REVENUE_INTRODUCTION":
    case "REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES":
    case "REVENUE_EXPECTED_SITE_RESALE":
    case "REVENUE_BUILDINGS_RESALE":
      return "Dépenses et recettes";
    case "SCHEDULE_INTRODUCTION":
    case "SCHEDULE_PROJECTION":
    case "PROJECT_PHASE":
      return "Calendrier et avancement";
    case "NAMING":
      return "Dénomination";
    case "FINAL_SUMMARY":
    case "CREATION_RESULT":
      return "Récapitulatif";
  }
};

type Props = {
  step: UrbanProjectCustomCreationStep;
};

function UrbanProjectCustomSteps({ step }: Props) {
  const currentStepCategory = getCategoryForStep(step);
  const displayBuildingsSection = useAppSelector((state) => hasBuildings(state.projectCreation));
  const stepCategories = displayBuildingsSection
    ? STEP_CATEGORIES
    : STEP_CATEGORIES.filter((step) => step !== "Bâtiments");
  const currentStepIndex = stepCategories.findIndex((step) => step === currentStepCategory);

  return (
    <FormStepper
      currentStepIndex={currentStepIndex}
      steps={stepCategories.map((step) => step)}
      isDone={step === "CREATION_RESULT"}
    />
  );
}

export default UrbanProjectCustomSteps;

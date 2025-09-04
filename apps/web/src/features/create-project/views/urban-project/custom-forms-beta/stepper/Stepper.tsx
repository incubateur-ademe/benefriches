import { selectHasBuildings } from "@/features/create-project/core/urban-project-beta/urbanProject.selectors";
import { UrbanProjectCustomCreationStep } from "@/features/create-project/core/urban-project/creationSteps";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import FormStepper from "@/shared/views/layout/WizardFormLayout/FormStepper";

const STEP_CATEGORIES = [
  "Type de projet",
  "Mode de création",
  "Espaces",
  "Aménagement des espaces",
  "Dépollution des sols",
  "Bâtiments",
  "Usage des lieux d'habitation et d'activité",
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
    case "URBAN_PROJECT_SPACES_CATEGORIES_INTRODUCTION":
    case "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION":
    case "URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA":
      return "Espaces";
    case "URBAN_PROJECT_SPACES_DEVELOPMENT_PLAN_INTRODUCTION":
    case "URBAN_PROJECT_GREEN_SPACES_INTRODUCTION":
    case "URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION":
    case "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_INTRODUCTION":
    case "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION":
    case "URBAN_PROJECT_PUBLIC_SPACES_INTRODUCTION":
    case "URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION":
    case "URBAN_PROJECT_SPACES_SOILS_SUMMARY":
    case "URBAN_PROJECT_SOILS_CARBON_SUMMARY":
      return "Aménagement des espaces";
    case "URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION":
    case "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION":
    case "URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA":
      return "Dépollution des sols";
    case "URBAN_PROJECT_BUILDINGS_INTRODUCTION":
    case "URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA":
      return "Bâtiments";
    case "URBAN_PROJECT_BUILDINGS_USE_INTRODUCTION":
    case "URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION":
      return "Usage des lieux d'habitation et d'activité";
    case "URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION":
    case "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER":
    case "URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER":
      return "Acteurs";
    case "URBAN_PROJECT_SITE_RESALE_INTRODUCTION":
    case "URBAN_PROJECT_SITE_RESALE_SELECTION":
    case "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION":
      return "Cession foncière";
    case "URBAN_PROJECT_EXPENSES_INTRODUCTION":
    case "URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS":
    case "URBAN_PROJECT_EXPENSES_REINSTATEMENT":
    case "URBAN_PROJECT_EXPENSES_INSTALLATION":
    case "URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES":
    case "URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE":
    case "URBAN_PROJECT_REVENUE_INTRODUCTION":
    case "URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES":
    case "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE":
    case "URBAN_PROJECT_REVENUE_BUILDINGS_RESALE":
      return "Dépenses et recettes";
    case "URBAN_PROJECT_SCHEDULE_INTRODUCTION":
    case "URBAN_PROJECT_SCHEDULE_PROJECTION":
    case "URBAN_PROJECT_PROJECT_PHASE":
      return "Calendrier et avancement";
    case "URBAN_PROJECT_NAMING":
      return "Dénomination";
    case "URBAN_PROJECT_FINAL_SUMMARY":
    case "URBAN_PROJECT_CREATION_RESULT":
      return "Récapitulatif";
  }
};

type Props = {
  step: UrbanProjectCustomCreationStep;
};

function UrbanProjectCustomStepper({ step }: Props) {
  const currentStepCategory = getCategoryForStep(step);
  const displayBuildingsSection = useAppSelector(selectHasBuildings);

  const stepCategories = displayBuildingsSection
    ? STEP_CATEGORIES
    : STEP_CATEGORIES.filter(
        (step) => !["Bâtiments", "Usage des lieux d'habitation et d'activité"].includes(step),
      );
  const currentStepIndex = stepCategories.findIndex((step) => step === currentStepCategory);

  return (
    <FormStepper
      currentStepIndex={currentStepIndex}
      steps={stepCategories.map((step) => step)}
      isDone={step === "URBAN_PROJECT_CREATION_RESULT"}
    />
  );
}

export default UrbanProjectCustomStepper;

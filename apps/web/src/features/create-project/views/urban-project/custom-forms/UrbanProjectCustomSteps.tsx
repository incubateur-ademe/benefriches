import { UrbanProjectCustomCreationStep } from "@/features/create-project/application/urban-project/urbanProject.reducer";
import FormStepper from "@/shared/views/layout/WizardFormLayout/FormStepper";

const stepCategories = [
  "Type de projet",
  "Mode de création",
  "Espaces",
  "Aménagement des espaces",
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
    case "SPACES_DEVELOPMENT_PLAN_SUMMARY":
      return "Aménagement des espaces";
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

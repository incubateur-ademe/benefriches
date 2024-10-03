import { UrbanProjectCustomCreationStep } from "@/features/create-project/application/mixed-use-neighbourhood/mixedUseNeighbourhoodProject.reducer";
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

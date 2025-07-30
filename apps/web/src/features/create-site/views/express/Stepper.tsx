import { SiteCreationExpressStep } from "@/features/create-site/core/createSite.reducer";
import FormStepper from "@/shared/views/layout/WizardFormLayout/FormStepper";

const STEPS_CATEGORIES = ["Introduction", "Adresse", "Superficie", "Récapitulatif"] as const;

type StepCategory = (typeof STEPS_CATEGORIES)[number];

const getCurrentStepCategory = (step: SiteCreationExpressStep): StepCategory => {
  switch (step) {
    case "AGRICULTURAL_OPERATION_ACTIVITY":
    case "NATURAL_AREA_TYPE":
    case "FRICHE_ACTIVITY":
      return "Introduction";
    case "ADDRESS":
      return "Adresse";
    case "SURFACE_AREA":
      return "Superficie";
    case "CREATION_RESULT":
      return "Récapitulatif";
  }
};

type Props = {
  step: SiteCreationExpressStep;
};

function SiteCreationExpressStepper({ step }: Props) {
  const currentStepCategory = getCurrentStepCategory(step);

  const currentStepIndex = STEPS_CATEGORIES.findIndex((step) => step === currentStepCategory);

  return (
    <FormStepper
      currentStepIndex={currentStepIndex}
      steps={[...STEPS_CATEGORIES]}
      isDone={step === "CREATION_RESULT"}
    />
  );
}

export default SiteCreationExpressStepper;

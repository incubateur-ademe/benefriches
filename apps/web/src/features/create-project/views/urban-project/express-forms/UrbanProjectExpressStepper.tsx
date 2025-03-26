import { UrbanProjectExpressCreationStep } from "@/features/create-project/core/urban-project/creationSteps";
import FormStepper from "@/shared/views/layout/WizardFormLayout/FormStepper";

const stepCategories = ["Type de projet", "Mode de création", "Récapitulatif"] as const;

type Props = {
  step: UrbanProjectExpressCreationStep;
};

function UrbanProjectExpressStepper({ step }: Props) {
  const stepCategory =
    step === "URBAN_PROJECT_CREATION_RESULT" ? "Récapitulatif" : "Mode de création";
  const currentStepIndex = stepCategories.findIndex((step) => step === stepCategory);

  return (
    <FormStepper
      currentStepIndex={currentStepIndex}
      steps={stepCategories.map((step) => step)}
      isDone={step === "URBAN_PROJECT_CREATION_RESULT"}
    />
  );
}

export default UrbanProjectExpressStepper;

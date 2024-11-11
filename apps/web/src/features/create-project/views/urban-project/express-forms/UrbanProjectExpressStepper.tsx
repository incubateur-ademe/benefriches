import { UrbanProjectExpressCreationStep } from "@/features/create-project/application/urban-project/urbanProject.reducer";
import FormStepper from "@/shared/views/layout/WizardFormLayout/FormStepper";

const stepCategories = ["Type de projet", "Mode de création", "Récapitulatif"] as const;

type Props = {
  step: UrbanProjectExpressCreationStep;
};

function UrbanProjectExpressStepper({ step }: Props) {
  const stepCategory = step === "CREATION_RESULT" ? "Récapitulatif" : "Mode de création";
  const currentStepIndex = stepCategories.findIndex((step) => step === stepCategory);

  return (
    <FormStepper
      currentStepIndex={currentStepIndex}
      steps={stepCategories.map((step) => step)}
      isDone={step === "CREATION_RESULT"}
    />
  );
}

export default UrbanProjectExpressStepper;

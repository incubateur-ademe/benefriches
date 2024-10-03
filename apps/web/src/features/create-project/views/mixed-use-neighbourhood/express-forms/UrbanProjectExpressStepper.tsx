import { MixedUseNeighbourhoodExpressCreationStep } from "@/features/create-project/application/mixed-use-neighbourhood/mixedUseNeighbourhoodProject.reducer";
import FormStepper from "@/shared/views/layout/WizardFormLayout/FormStepper";

const stepCategories = ["Type de projet", "Mode de création", "Récapitulatif"] as const;

type Props = {
  step: MixedUseNeighbourhoodExpressCreationStep;
  isExtended?: boolean;
};

function UrbanProjectExpressStepper({ isExtended }: Props) {
  const stepCategory = "Mode de création";
  const currentStepIndex = stepCategories.findIndex((step) => step === stepCategory);

  return (
    <FormStepper
      currentStepIndex={currentStepIndex}
      steps={stepCategories.map((step) => step)}
      isExtended={isExtended}
      isDone
    />
  );
}

export default UrbanProjectExpressStepper;

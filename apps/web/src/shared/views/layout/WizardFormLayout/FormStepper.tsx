import FormStepperStep from "./FormStepperStep";
import FormStepperWrapper from "./FormStepperWrapper";

type Props = {
  currentStepIndex: number;
  steps: string[];
  isDone?: boolean;
};

const getStepVariant = (stepIndex: number, currentStepIndex: number, formIsDone: boolean) => {
  const isPreviousStep = currentStepIndex > stepIndex;
  const isCurrent = currentStepIndex === stepIndex;
  const isCompleted = isPreviousStep || (isCurrent && formIsDone);

  return isCurrent ? "current" : isCompleted ? "completed" : "empty";
};

function FormStepper({ steps, currentStepIndex, isDone = false }: Props) {
  return (
    <FormStepperWrapper>
      {steps.map((title, index) => (
        <FormStepperStep
          key={title}
          title={title}
          variant={getStepVariant(index, currentStepIndex, isDone)}
        />
      ))}
    </FormStepperWrapper>
  );
}

export default FormStepper;

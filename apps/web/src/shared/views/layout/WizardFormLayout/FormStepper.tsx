import { StepVariant } from "./FormBaseStepperStep";
import FormStepperStep from "./FormStepperStep";
import FormStepperWrapper from "./FormStepperWrapper";

type Props = {
  currentStepIndex: number;
  steps: string[];
  isDone?: boolean;
};

const getStepVariant = (
  stepIndex: number,
  currentStepIndex: number,
  formIsDone: boolean,
): StepVariant => {
  const isPreviousStep = currentStepIndex > stepIndex;
  const isCurrent = currentStepIndex === stepIndex;
  const isCompleted = isPreviousStep || (isCurrent && formIsDone);

  return {
    activity: isCurrent ? "current" : "inactive",
    validation: isCompleted ? "completed" : "empty",
  };
};

function FormStepper({ steps, currentStepIndex, isDone = false }: Props) {
  return (
    <FormStepperWrapper>
      {steps.map((title, stepIndex) => (
        <FormStepperStep
          key={title}
          title={title}
          variant={getStepVariant(stepIndex, currentStepIndex, isDone)}
        />
      ))}
    </FormStepperWrapper>
  );
}

export default FormStepper;

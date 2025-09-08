import classNames from "@/shared/views/clsx";

import FormStepperStep from "./FormStepperStep";

type Props = {
  currentStepIndex: number;
  steps: string[];
  isDone?: boolean;
};

const getStepState = (stepIndex: number, currentStepIndex: number, formIsDone: boolean) => {
  const isPreviousStep = currentStepIndex > stepIndex;
  const isCurrent = currentStepIndex === stepIndex;
  const isCompleted = isPreviousStep || (isCurrent && formIsDone);

  return isCurrent ? "current" : isCompleted ? "completed" : "empty";
};

function FormStepper({ steps, currentStepIndex, isDone = false }: Props) {
  return (
    <ol role="list" className={classNames("list-none", "list-inside", "p-0")}>
      {steps.map((title, index) => (
        <FormStepperStep
          key={title}
          title={title}
          state={getStepState(index, currentStepIndex, isDone)}
        />
      ))}
    </ol>
  );
}

export default FormStepper;

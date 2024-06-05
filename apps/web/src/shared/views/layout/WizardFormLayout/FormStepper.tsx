import classNames from "@/shared/views/clsx";

type Props = {
  currentStepIndex: number;
  steps: string[];
  isExtended?: boolean;
  isDone?: boolean;
};

type StepProps = {
  title: string;
  index: number;
  currentStepIndex: number;
  isDone: boolean;
  isExtended: boolean;
};

const Step = ({ title, index, currentStepIndex, isDone, isExtended }: StepProps) => {
  const isCurrent = currentStepIndex === index && !isDone;
  const isCompleted = isDone || currentStepIndex > index;

  return (
    <li
      className={classNames(
        "tw-flex",
        "tw-items-center",
        "tw-py-4",
        "tw-px-2",
        "marker:tw-content-none",
        !isExtended && "tw-justify-center",
        isCompleted && "tw-text-green-main",
        isCurrent && ["tw-bg-blue-light", "tw-text-blue-dark"],
      )}
      key={title}
    >
      <span
        className={classNames(
          isExtended ? "tw-mx-4" : "tw-mx-0",
          isCompleted && "fr-icon-success-line tw-text-green-light",
          (!isCompleted || isCurrent) && [
            "before:tw-content-[counter(li-counter)]",
            "tw-font-bold",
            "tw-text-xs",
            "tw-bg-blue-main",
            "tw-text-white",
            "tw-rounded-full",
            "tw-leading-6",
            "tw-w-6",
            "tw-h-6",
            "tw-text-center",
          ],
          !isCompleted && "tw-bg-grey-main",
        )}
        aria-hidden="true"
      ></span>
      {isExtended && (
        <>
          {title}
          {isCurrent && (
            <span className="fr-icon-arrow-right-s-line tw-ml-auto" aria-hidden="true"></span>
          )}
        </>
      )}
    </li>
  );
};

function FormStepper({ steps, currentStepIndex, isExtended = true, isDone = false }: Props) {
  return (
    <ol role="list" className={classNames("tw-list-none", "tw-list-inside", "tw-p-0", "tw-my-6")}>
      {steps.map((title, index) => (
        <Step
          key={title}
          title={title}
          index={index}
          currentStepIndex={currentStepIndex}
          isDone={isDone}
          isExtended={isExtended}
        />
      ))}
    </ol>
  );
}

export default FormStepper;

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
  const isPreviousStep = currentStepIndex > index;
  const isCurrent = currentStepIndex === index;
  const isCompleted = isPreviousStep || (isCurrent && isDone);

  return (
    <li
      className={classNames(
        "tw-flex",
        "tw-items-center",
        "tw-p-2",
        "marker:tw-content-none",
        "tw-text-sm",
        !isExtended && "tw-justify-center",
        isCompleted && "tw-text-green-main",
        isCurrent
          ? ["tw-bg-blue-light dark:tw-bg-blue-dark", "tw-text-blue-dark dark:tw-text-blue-light"]
          : "tw-text-dsfr-greyDisabled",
      )}
      key={title}
    >
      <span
        className={classNames(
          isExtended ? "tw-mx-4" : "tw-mx-0",
          isCompleted
            ? "fr-icon-success-line tw-text-green-light"
            : [
                "before:tw-content-[counter(li-counter)]",
                "tw-font-bold",
                "tw-text-xs",
                "tw-text-white",
                "tw-rounded-full",
                "tw-leading-6",
                "tw-w-6",
                "tw-h-6",
                "tw-text-center",
                isCurrent ? "tw-bg-blue-main" : "tw-bg-grey-main dark:tw-bg-grey-dark",
              ],
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
    <ol role="list" className={classNames("tw-list-none", "tw-list-inside", "tw-p-0")}>
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

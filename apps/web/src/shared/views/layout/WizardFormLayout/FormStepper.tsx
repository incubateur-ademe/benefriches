import { useContext } from "react";

import classNames from "@/shared/views/clsx";

import { SidebarLayoutContext } from "../SidebarLayout/SidebarLayoutContext";

type Props = {
  currentStepIndex: number;
  steps: string[];
  isDone?: boolean;
};

type StepProps = {
  title: string;
  index: number;
  currentStepIndex: number;
  isDone: boolean;
};

const Step = ({ title, index, currentStepIndex, isDone }: StepProps) => {
  const isPreviousStep = currentStepIndex > index;
  const isCurrent = currentStepIndex === index;
  const isCompleted = isPreviousStep || (isCurrent && isDone);

  const { isOpen: isExtended } = useContext(SidebarLayoutContext);

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
          ? [
              "tw-bg-blue-ultralight dark:tw-bg-blue-ultradark",
              "tw-text-blue-ultradark dark:tw-text-blue-ultralight",
            ]
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
                "tw-min-w-6",
                "tw-h-6",
                "tw-text-center",
                isCurrent ? "tw-bg-blue-main" : "tw-bg-grey-main dark:tw-bg-grey-dark",
              ],
        )}
        aria-hidden="true"
      />
      {isExtended && (
        <>
          <span className={isCurrent ? "tw-font-medium" : ""}>{title}</span>
          {isCurrent && (
            <span className="fr-icon-arrow-right-s-line tw-ml-auto" aria-hidden="true"></span>
          )}
        </>
      )}
    </li>
  );
};

function FormStepper({ steps, currentStepIndex, isDone = false }: Props) {
  return (
    <ol role="list" className={classNames("tw-list-none", "tw-list-inside", "tw-p-0")}>
      {steps.map((title, index) => (
        <Step
          key={title}
          title={title}
          index={index}
          currentStepIndex={currentStepIndex}
          isDone={isDone}
        />
      ))}
    </ol>
  );
}

export default FormStepper;

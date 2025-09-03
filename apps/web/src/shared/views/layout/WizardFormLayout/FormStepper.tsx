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
        "flex",
        "items-center",
        "p-2",
        "marker:content-none",
        "text-sm",
        !isExtended && "justify-center",
        isCompleted && "text-green-main",
        isCurrent
          ? [
              "bg-blue-ultralight dark:bg-blue-ultradark",
              "text-blue-ultradark dark:text-blue-ultralight",
            ]
          : "text-dsfr-grey-disabled",
      )}
      key={title}
    >
      <span
        className={classNames(
          isExtended ? "mx-4" : "mx-0",
          isCompleted
            ? "fr-icon-success-line text-green-light"
            : [
                "before:content-[counter(li-counter)]",
                "font-bold",
                "text-xs",
                "text-white",
                "rounded-full",
                "leading-6",
                "min-w-6",
                "h-6",
                "text-center",
                isCurrent ? "bg-blue-medium" : "bg-grey-main dark:bg-grey-dark",
              ],
        )}
        aria-hidden="true"
      />
      {isExtended && (
        <>
          <span className={isCurrent ? "font-medium" : ""}>{title}</span>
          {isCurrent && (
            <span className="fr-icon-arrow-right-s-line ml-auto" aria-hidden="true"></span>
          )}
        </>
      )}
    </li>
  );
};

function FormStepper({ steps, currentStepIndex, isDone = false }: Props) {
  return (
    <ol role="list" className={classNames("list-none", "list-inside", "p-0")}>
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

import { HtmlHTMLAttributes } from "react";

import FormStepperStep from "@/shared/views/layout/WizardFormLayout/FormStepperStep";

import { CategoryState } from "./Stepper";

type StepperLiItemProps = {
  title: string;
  state: CategoryState;
  onClick: () => void;
  isNextAvailable: boolean;
  isFormDisabled?: boolean;
} & HtmlHTMLAttributes<HTMLLIElement>;

const StepperLiItem = ({
  title,
  state,
  onClick,
  isFormDisabled,
  isNextAvailable,
  children,
  className,
}: StepperLiItemProps) => {
  const isDisabled = isFormDisabled || !(state === "completed" || isNextAvailable);
  const buttonProps = !isDisabled ? { onClick, role: "button" } : undefined;

  return (
    <li className="p-0">
      <FormStepperStep
        title={title}
        state={state}
        className={className}
        selectable
        disabled={isDisabled}
        {...buttonProps}
      />
      {children}
    </li>
  );
};

export default StepperLiItem;

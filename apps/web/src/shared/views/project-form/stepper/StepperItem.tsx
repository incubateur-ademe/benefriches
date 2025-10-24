import { HtmlHTMLAttributes, useMemo } from "react";

import classNames from "@/shared/views/clsx";
import FormStepperStep, { StepProps } from "@/shared/views/layout/WizardFormLayout/FormStepperStep";

import { CategoryState } from "./useMapStepListToCategoryList";

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
  const isDisabled = useMemo(
    () => isFormDisabled || !(state === "completed" || isNextAvailable),
    [isFormDisabled, isNextAvailable, state],
  );

  const extraProps: Pick<StepProps, "className" | "as" | "onClick"> = useMemo(() => {
    return !isDisabled
      ? {
          onClick,
          as: "button",
          className: classNames("text-left w-full", className),
        }
      : { className, as: "div" };
  }, [className, isDisabled, onClick]);

  return (
    <li className="p-0">
      <FormStepperStep
        title={title}
        state={state}
        selectable
        disabled={isDisabled}
        {...extraProps}
      />
      {children}
    </li>
  );
};

export default StepperLiItem;

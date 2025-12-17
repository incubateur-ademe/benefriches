import { HtmlHTMLAttributes, useMemo } from "react";

import classNames from "@/shared/views/clsx";
import FormStepperStep, {
  FormStepperStepProps,
} from "@/shared/views/layout/WizardFormLayout/FormStepperStep";

type StepperLiItemProps = {
  title: FormStepperStepProps["title"];
  variant: FormStepperStepProps["variant"];
  onClick: () => void;
  isNextAvailable: boolean;
  isFormDisabled?: boolean;
} & HtmlHTMLAttributes<HTMLLIElement>;

const StepperLiItem = ({
  title,
  variant,
  onClick,
  isFormDisabled,
  isNextAvailable,
  children,
  className,
}: StepperLiItemProps) => {
  const isDisabled = useMemo(
    () => isFormDisabled || !(variant.validation === "completed" || isNextAvailable),
    [isFormDisabled, isNextAvailable, variant],
  );

  const extraProps: Pick<FormStepperStepProps, "className" | "as" | "onClick"> = useMemo(() => {
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
        variant={variant}
        selectable
        disabled={isDisabled}
        {...extraProps}
      />
      {children}
    </li>
  );
};

export default StepperLiItem;

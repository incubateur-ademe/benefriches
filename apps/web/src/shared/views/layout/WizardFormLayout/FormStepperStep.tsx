import classNames from "@/shared/views/clsx";

import BaseStepperStep, {
  BaseStepperStepProps,
  SHARED_STYLES,
  VariantStyleConfig,
} from "./FormBaseStepperStep";

const CHECK_ICON = "fr-icon-check-line text-success-dark";

const FORM_STEPPER_STYLES: VariantStyleConfig = {
  "current-empty": [
    SHARED_STYLES.numberMarker,
    "before:bg-benefriches-dark",
    "text-blue-ultradark dark:text-blue-ultralight",
    "bg-blue-ultralight dark:bg-blue-ultradark",
    "font-medium",
  ],
  "current-completed": [
    CHECK_ICON,
    "text-green-main",
    "bg-blue-ultralight dark:bg-blue-ultradark",
    "font-medium",
  ],

  "groupActive-empty": [
    SHARED_STYLES.numberMarker,
    "before:bg-benefriches-dark",
    "text-blue-ultradark dark:text-blue-ultralight",
    "bg-blue-ultralight dark:bg-blue-ultradark",
  ],
  "groupActive-completed": [
    CHECK_ICON,
    "text-green-main",
    "bg-blue-ultralight dark:bg-blue-ultradark",
  ],

  "inactive-empty": [
    SHARED_STYLES.numberMarker,
    "before:bg-text-medium dark:before:bg-grey-dark",
    "text-dsfr-greyDisabled",
  ],
  "inactive-completed": [CHECK_ICON, "text-green-main"],
};

export type FormStepperStepProps = Omit<BaseStepperStepProps, "variantStyles"> & {
  selectable?: boolean;
  disabled?: boolean;
};

const FormStepperStep = ({
  selectable = false,
  disabled = false,
  onClick,
  className,
  ...props
}: FormStepperStepProps) => {
  return (
    <BaseStepperStep
      {...props}
      as="li"
      variantStyles={FORM_STEPPER_STYLES}
      className={classNames(
        selectable && [
          "hover:bg-blue-ultralight hover:dark:bg-blue-ultradark",
          disabled ? "cursor-not-allowed" : "cursor-pointer",
        ],
        className,
      )}
      onClick={!disabled && selectable ? onClick : undefined}
    />
  );
};

export default FormStepperStep;

import { fr } from "@codegouvfr/react-dsfr";

import BaseStepperStep, {
  BaseStepperStepProps,
  SHARED_STYLES,
  VariantStyleConfig,
} from "@/shared/views/layout/WizardFormLayout/FormBaseStepperStep";

type UpdateStepperStepProps = Omit<BaseStepperStepProps, "variantStyles" | "as">;

const WARNING_ICON = [
  fr.cx("fr-icon-error-warning-line"),
  "text-warning-ultradark dark:text-warning-ultralight",
];

const UPDATE_STEPPER_STYLES: VariantStyleConfig = {
  "current-empty": [
    WARNING_ICON,
    "bg-warning-light dark:bg-warning-dark",
    "hover:bg-warning-light dark:hover:bg-warning-dark",
    "font-medium",
  ],
  "current-completed": [
    SHARED_STYLES.numberMarker,
    "before:bg-blue-ultradark",
    "bg-blue-ultralight dark:bg-blue-ultradark",
    "text-blue-ultradark dark:text-blue-ultralight",
    "hover:bg-blue-ultralight hover:dark:bg-blue-ultradark",
    "font-medium",
  ],

  "groupActive-empty": [
    WARNING_ICON,
    "bg-warning-ultralight dark:bg-warning-ultradark",
    "hover:bg-warning-light dark:hover:bg-warning-dark",
  ],
  "groupActive-completed": [
    SHARED_STYLES.numberMarker,
    "before:bg-blue-ultradark",
    "bg-blue-ultralight dark:bg-blue-ultradark",
    "text-blue-ultradark dark:text-blue-ultralight",
    "hover:bg-blue-ultralight hover:dark:bg-blue-ultradark",
  ],

  "inactive-empty": [
    WARNING_ICON,
    "bg-warning-ultralight dark:bg-warning-ultradark",
    "hover:bg-warning-light dark:hover:bg-warning-dark",
  ],
  "inactive-completed": [
    SHARED_STYLES.numberMarker,
    "before:bg-blue-ultradark",
    "hover:bg-blue-ultralight hover:dark:bg-blue-ultradark",
  ],
};

const UpdateStepperStep = (props: UpdateStepperStepProps) => {
  return <BaseStepperStep {...props} as="button" variantStyles={UPDATE_STEPPER_STYLES} />;
};

export default UpdateStepperStep;

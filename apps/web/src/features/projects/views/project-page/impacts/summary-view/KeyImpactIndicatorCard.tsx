import { fr } from "@codegouvfr/react-dsfr";

import classNames from "@/shared/views/clsx";

type Props = {
  title: string;
  type: "success" | "error";
  description?: string;
  buttonProps: {
    "data-fr-opened": boolean;
    "aria-controls": string;
  };
};

const POSITIVE_CLASSES = [
  "tw-bg-impacts-positive-light hover:!tw-bg-impacts-positive-light",
  "dark:tw-bg-impacts-positive-main dark:hover:!tw-bg-impacts-positive-main",
  "hover:tw-border-impacts-positive-border",
];
const NEGATIVE_CLASSES = [
  "tw-bg-impacts-negative-light hover:!tw-bg-impacts-negative-light",
  "dark:tw-bg-impacts-negative-main dark:hover:!tw-bg-impacts-negative-main",
  "hover:tw-border-impacts-negative-border",
];

const KeyImpactIndicatorCard = ({ title, type, description, buttonProps }: Props) => {
  return (
    <button
      {...buttonProps}
      className={classNames(
        "tw-flex tw-justify-start tw-items-center tw-gap-4",
        "tw-p-4",
        "tw-rounded-md",
        "tw-border tw-border-solid tw-border-transparent",
        "hover:tw-scale-x-105",
        type === "success" ? POSITIVE_CLASSES : NEGATIVE_CLASSES,
        "tw-transition tw-ease-in-out tw-duration-500",
        "tw-text-left",
      )}
    >
      <span
        className={classNames(
          "fr-icon--xxl",
          type === "success"
            ? [fr.cx("fr-icon-checkbox-circle-fill"), "tw-text-impacts-positive-border"]
            : [fr.cx("fr-icon-warning-fill"), "tw-text-impacts-negative-border"],
        )}
        aria-hidden="true"
      ></span>
      <div>
        <h3 className="tw-text-lg tw-font-bold tw-mb-0">{title}</h3>
        {description && <p className="tw-pt-2 tw-m-0 dark:tw-text-grey-light">{description}</p>}
      </div>
    </button>
  );
};

export default KeyImpactIndicatorCard;

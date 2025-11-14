import { fr } from "@codegouvfr/react-dsfr";

import classNames from "@/shared/views/clsx";

type Props = {
  title: string;
  type: "success" | "error";
  buttonProps: {
    "data-fr-opened": boolean;
    "aria-controls": string;
  };
};

const POSITIVE_CLASSES = [
  "bg-success-ultralight hover:bg-success-ultralight!",
  "dark:bg-success-ultradark dark:hover:bg-success-ultradark!",
  "hover:border-success-light",
];
const NEGATIVE_CLASSES = [
  "bg-error-ultralight hover:bg-error-ultralight!",
  "dark:bg-error-ultradark dark:hover:bg-error-ultradark!",
  "hover:border-error-light dark:hover:border-error-dark",
];

const KeyImpactIndicatorCard = ({ title, type, buttonProps }: Props) => {
  return (
    <button
      {...buttonProps}
      className={classNames(
        "flex justify-start items-center gap-4",
        "p-4",
        "rounded-md",
        "border border-solid border-transparent",
        "hover:scale-x-105",
        type === "success" ? POSITIVE_CLASSES : NEGATIVE_CLASSES,
        "transition ease-in-out duration-500",
        "text-left",
      )}
    >
      <span
        className={classNames(
          "fr-icon--xxl",
          type === "success"
            ? [fr.cx("fr-icon-checkbox-circle-fill"), "text-success-light"]
            : [fr.cx("fr-icon-warning-fill"), "text-error-light"],
        )}
        aria-hidden="true"
      ></span>
      <h4 className="text-lg font-bold mb-0">{title}</h4>
    </button>
  );
};

export default KeyImpactIndicatorCard;

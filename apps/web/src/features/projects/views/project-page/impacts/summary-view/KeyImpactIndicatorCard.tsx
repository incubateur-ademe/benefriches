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
  "bg-impacts-positive-light hover:bg-impacts-positive-light!",
  "dark:bg-impacts-positive-main dark:hover:bg-impacts-positive-main!",
  "hover:border-impacts-positive-border",
];
const NEGATIVE_CLASSES = [
  "bg-impacts-negative-light hover:bg-impacts-negative-light!",
  "dark:bg-impacts-negative-main dark:hover:bg-impacts-negative-main!",
  "hover:border-impacts-negative-border",
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
            ? [fr.cx("fr-icon-checkbox-circle-fill"), "text-impacts-positive-border"]
            : [fr.cx("fr-icon-warning-fill"), "text-impacts-negative-border"],
        )}
        aria-hidden="true"
      ></span>
      <h4 className="text-lg font-bold mb-0">{title}</h4>
    </button>
  );
};

export default KeyImpactIndicatorCard;

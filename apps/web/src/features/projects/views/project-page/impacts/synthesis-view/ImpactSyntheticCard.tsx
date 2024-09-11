import { useId } from "react";
import { fr } from "@codegouvfr/react-dsfr";

import classNames from "@/shared/views/clsx";

type Props = {
  text: string;
  type: "success" | "error";
  tooltipText?: string;
};

const ImpactSyntheticCard = ({ text, type, tooltipText }: Props) => {
  const id = useId();
  return (
    <>
      <div
        aria-describedby={`tooltip-${id}`}
        className={classNames(
          "tw-flex",
          "tw-justify-start",
          "tw-items-center",
          "tw-gap-4",
          "tw-p-4",
          "tw-rounded-md",
          "tw-text-lg",
          "tw-font-bold",
          "hover:tw-scale-105",
          "hover:tw-border",
          "hover:tw-border-solid",
          type === "success"
            ? ["tw-bg-impacts-positive-light", "tw-border-impacts-positive-border"]
            : ["tw-bg-impacts-negative-light", " tw-border-impacts-negative-border"],
        )}
      >
        <span
          className={classNames(
            "fr-icon--xl",
            type === "success"
              ? [fr.cx("fr-icon-checkbox-circle-fill"), "tw-text-impacts-positive-border"]
              : [fr.cx("fr-icon-warning-fill"), "tw-text-impacts-negative-border"],
          )}
          aria-hidden="true"
        ></span>

        {text}
      </div>
      <span
        className={fr.cx("fr-tooltip", "fr-placement")}
        id={`tooltip-${id}`}
        role="tooltip"
        aria-hidden="true"
      >
        {tooltipText}
      </span>
    </>
  );
};

export default ImpactSyntheticCard;

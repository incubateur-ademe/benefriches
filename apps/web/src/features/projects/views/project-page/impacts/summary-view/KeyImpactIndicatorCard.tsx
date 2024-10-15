import { fr } from "@codegouvfr/react-dsfr";
import { useId } from "react";

import classNames from "@/shared/views/clsx";

export type Props = {
  title: string;
  type: "success" | "error";
  description?: string;
  descriptionDisplayMode?: "inline" | "tooltip";
};

const KeyImpactIndicatorCard = ({
  title,
  type,
  description,
  descriptionDisplayMode = "inline",
}: Props) => {
  const id = useId();
  const displayTooltip = !!description && descriptionDisplayMode === "tooltip";
  const displayDescriptionInline = !!description && descriptionDisplayMode === "inline";
  return (
    <>
      <article
        aria-describedby={displayTooltip ? `tooltip-${id}` : undefined}
        className={classNames(
          "tw-flex tw-justify-start tw-items-center tw-gap-4",
          "tw-p-4",
          "tw-rounded-md",
          "tw-border tw-border-solid tw-border-transparent",
          type === "success"
            ? ["tw-bg-impacts-positive-light", "dark:tw-bg-impacts-positive-main"]
            : ["tw-bg-impacts-negative-light", "dark:tw-bg-impacts-negative-main"],
          displayTooltip && [
            "tw-transition tw-ease-in-out tw-duration-500",
            type === "success"
              ? "hover:tw-border-impacts-positive-border"
              : "hover:tw-border-impacts-negative-border",
          ],
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
        <div>
          <h3 className="tw-text-lg tw-font-bold tw-mb-0">{title}</h3>
          {displayDescriptionInline && (
            <p className="tw-pt-2 tw-m-0 dark:tw-text-grey-light">{description}</p>
          )}
        </div>
      </article>
      {displayTooltip && (
        <span
          className={fr.cx("fr-tooltip", "fr-placement")}
          id={`tooltip-${id}`}
          role="tooltip"
          aria-hidden="true"
        >
          {description}
        </span>
      )}
    </>
  );
};

export default KeyImpactIndicatorCard;

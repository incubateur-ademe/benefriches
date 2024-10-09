import Button from "@codegouvfr/react-dsfr/Button";
import { MouseEvent, ReactNode, useState } from "react";

import classNames from "@/shared/views/clsx";

import {
  formatCO2Impact,
  formatDefaultImpact,
  formatETPImpact,
  formatMonetaryImpact,
  formatSurfaceAreaImpact,
  formatTimeImpact,
} from "../../../shared/formatImpactValue";

type Props = {
  value?: number;
  actor?: string;
  label: ReactNode;
  isTotal?: boolean;
  onToggleAccordion?: (e?: MouseEvent<HTMLElement>) => void;
  onLabelClick?: (e?: MouseEvent<HTMLElement>) => void;
  isAccordionOpened?: boolean;
  type?: "surfaceArea" | "monetary" | "co2" | "default" | "etp" | "time";
};

const impactTypeFormatterMap = {
  co2: formatCO2Impact,
  monetary: formatMonetaryImpact,
  surfaceArea: formatSurfaceAreaImpact,
  etp: formatETPImpact,
  time: formatTimeImpact,
  default: formatDefaultImpact,
} as const;

const ImpactRowValue = ({
  value,
  label,
  actor,
  type = "default",
  isTotal = false,
  onToggleAccordion,
  isAccordionOpened,
  onLabelClick,
}: Props) => {
  const [isSectionHovered, setIsSectionHovered] = useState(false);

  return (
    <div
      className={classNames(
        "tw-grid",
        `tw-grid-cols-[2rem_1fr_9rem_8rem]`,
        "tw-relative",
        "tw-items-center",
      )}
      onMouseEnter={() => {
        setIsSectionHovered(true);
      }}
      onMouseLeave={() => {
        setIsSectionHovered(false);
      }}
    >
      {onToggleAccordion && (
        <Button
          className={classNames(
            "tw-col-start-1",
            "tw-text-black",
            "tw-text-xl",
            "tw-absolute",
            "tw-left-[-0.5rem]",
          )}
          iconId={isAccordionOpened ? "fr-icon-arrow-up-s-fill" : "fr-icon-arrow-down-s-fill"}
          onClick={onToggleAccordion}
          size="small"
          priority="tertiary no outline"
          title={isAccordionOpened ? "Fermer la section" : "Afficher la section"}
        />
      )}
      <div className={classNames("tw-col-start-2", "*:tw-inline-block")}>
        <span
          className={classNames(
            isTotal && "tw-font-bold",
            !!onLabelClick && "tw-cursor-pointer",
            isSectionHovered && !!onLabelClick && "tw-font-bold",
          )}
          onClick={onLabelClick}
        >
          {label}
        </span>
        {onLabelClick && (
          <button
            onClick={onLabelClick}
            className={classNames(
              "fr-link",
              "fr-link--sm",
              "tw-ml-2",
              "tw-px-2",
              "tw-transition-opacity",
              "tw-ease-in",
              "tw-delay-300",
              "tw-duration-50",
              isSectionHovered ? "tw-opacity-100" : "tw-opacity-0 tw-duration-0 tw-delay-0",
            )}
          >
            En&nbsp;savoir&nbsp;plus
          </button>
        )}
      </div>

      <span className="tw-col-start-3">{actor}</span>

      <div
        aria-hidden={value === undefined}
        className={classNames("tw-flex", "tw-items-center", "tw-justify-end", "tw-col-start-4")}
      >
        {value !== undefined && (
          <div
            className={classNames(
              "tw-py-1",
              isTotal && "tw-font-bold",
              value === 0 && "tw-text-impacts-neutral-main dark:tw-text-impacts-neutral-light",
              value > 0 && "tw-text-impacts-positive-main dark:tw-text-impacts-positive-light",
              value < 0 && "tw-text-impacts-negative-main dark:tw-text-impacts-negative-light",
            )}
          >
            {impactTypeFormatterMap[type](value)}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImpactRowValue;

import { ReactNode } from "react";
import Button from "@codegouvfr/react-dsfr/Button";
import {
  formatCO2Impact,
  formatDefaultImpact,
  formatETPImpact,
  formatMonetaryImpact,
  formatSurfaceAreaImpact,
  formatTimeImpact,
} from "../../../shared/formatImpactValue";

import classNames from "@/shared/views/clsx";

type Props = {
  value?: number;
  isTotal?: boolean;
  onClick?: () => void;
  onToggleAccordion?: () => void;
  isAccordionOpened?: boolean;
  children: ReactNode;
  type?: "surfaceArea" | "monetary" | "co2" | "default" | "etp" | "time" | undefined;
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
  children,
  type = "default",
  isTotal = false,
  onClick,
  onToggleAccordion,
  isAccordionOpened,
}: Props) => {
  return (
    <div
      className={classNames(
        "tw-grid",
        "tw-grid-cols-[1fr_8rem_2rem]",
        !!onClick && ["tw-cursor-pointer", "hover:tw-scale-[1.02]", "hover:tw-font-bold"],
      )}
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick();
        }
      }}
    >
      <div className={classNames("tw-flex", "tw-items-center")}>{children}</div>

      <div
        aria-hidden={!value}
        className={classNames("tw-flex", "tw-items-center", "tw-justify-end")}
      >
        {value && (
          <div
            className={classNames(
              "tw-py-1",
              "tw-pr-4",
              isTotal && "tw-font-bold",
              value === 0
                ? "tw-text-impacts-neutral-main dark:tw-text-impacts-neutral-light"
                : value > 0
                  ? "tw-text-impacts-positive-main dark:tw-text-impacts-positive-light"
                  : "tw-text-impacts-negative-main dark:tw-text-impacts-negative-light",
            )}
          >
            {impactTypeFormatterMap[type](value)}
          </div>
        )}
      </div>
      {onToggleAccordion && (
        <Button
          className={classNames(
            "tw-border-borderGrey",
            "tw-border",
            "tw-border-solid",
            "tw-bg-white",
            "dark:tw-bg-grey-dark",
            "tw-shadow-none",
            "tw-rounded-sm",
            "tw-text-black",
            "dark:tw-text-white",
          )}
          size="small"
          iconId={isAccordionOpened ? "fr-icon-arrow-up-s-line" : "fr-icon-arrow-down-s-line"}
          onClick={(e) => {
            e.stopPropagation();
            onToggleAccordion();
          }}
          priority="secondary"
          title={isAccordionOpened ? "Fermer la section" : "Afficher la section"}
        />
      )}
    </div>
  );
};

export default ImpactRowValue;

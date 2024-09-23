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
  onToggleAccordion?: () => void;
  isAccordionOpened?: boolean;
  children: ReactNode;
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
  children,
  type = "default",
  isTotal = false,
  onToggleAccordion,
  isAccordionOpened,
}: Props) => {
  return (
    <div className={classNames("tw-grid", "tw-grid-cols-[1fr_8rem_2rem]")}>
      <div className={classNames("tw-flex", "tw-items-center")}>{children}</div>

      <div
        aria-hidden={value === undefined}
        className={classNames("tw-flex", "tw-items-center", "tw-justify-end")}
      >
        {value !== undefined && (
          <div
            className={classNames(
              "tw-py-1 tw-pr-4",
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
      {onToggleAccordion && (
        <Button
          className={classNames(
            "tw-border tw-border-solid tw-border-borderGrey",
            "tw-bg-white",
            "tw-text-black",
            "tw-rounded-sm",
            "tw-shadow-none",
            "dark:tw-bg-grey-dark",
            "dark:tw-text-white",
          )}
          size="small"
          iconId={isAccordionOpened ? "fr-icon-arrow-up-s-line" : "fr-icon-arrow-down-s-line"}
          onClick={() => {
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

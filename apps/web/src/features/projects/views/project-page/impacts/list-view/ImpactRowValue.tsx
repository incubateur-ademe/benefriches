import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import { useWindowInnerSize } from "@codegouvfr/react-dsfr/tools/useWindowInnerSize";
import { useBreakpointsValuesPx } from "@codegouvfr/react-dsfr/useBreakpointsValuesPx";
import { HtmlHTMLAttributes, MouseEvent } from "react";

import { getPositiveNegativeTextClassesFromValue } from "@/shared/views/classes/positiveNegativeTextClasses";
import classNames from "@/shared/views/clsx";

import {
  formatCO2Impact,
  formatDefaultImpact,
  formatETPImpact,
  formatMonetaryImpact,
  formatSurfaceAreaImpact,
  formatTimeImpact,
} from "../../../shared/formatImpactValue";

export type ImpactRowValueProps = {
  value?: number;
  actor?: string;
  label: string;
  isTotal?: boolean;
  onToggleAccordion?: (e?: MouseEvent<HTMLElement>) => void;
  isAccordionOpened?: boolean;
  buttonInfoAlwaysDisplayed?: boolean;
  type?: "surfaceArea" | "monetary" | "co2" | "default" | "etp" | "time";
  labelProps: HtmlHTMLAttributes<HTMLButtonElement> & { "data-fr-opened"?: boolean };
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
  labelProps,
  buttonInfoAlwaysDisplayed = false,
}: ImpactRowValueProps) => {
  const { breakpointsValues } = useBreakpointsValuesPx();
  const { windowInnerWidth } = useWindowInnerSize();

  const { className: labelClassNames, ...labelPropsRest } = labelProps;

  return (
    <div
      className={classNames(
        "tw-grid",
        `tw-grid-cols-[2rem_1fr_3rem]`,
        `md:tw-grid-cols-[2rem_1fr_9rem_8rem]`,
        "tw-relative",
        "tw-items-center",
        "tw-group",
      )}
    >
      {onToggleAccordion && (
        <Button
          className={classNames(
            "tw-col-start-1",
            "tw-text-black dark:tw-text-white",
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
      <button
        className={classNames(
          "tw-col-start-2",
          !actor && "md:tw-col-end-4",
          isTotal && "tw-font-bold",
          "tw-text-left",
          "group-hover:tw-font-bold",
          "group-focus:tw-font-bold",
          "group-hover:!tw-bg-inherit",
          "group-focus:!tw-bg-inherit",
          "tw-group",
          labelClassNames,
        )}
        {...labelPropsRest}
      >
        {label}
        <span
          className={classNames(
            "fr-link",
            "fr-link--sm",
            "md:tw-ml-2",
            "tw-px-2",
            "tw-transition-opacity",
            "tw-ease-in",
            "tw-duration-50",
            "tw-font-normal",
            !buttonInfoAlwaysDisplayed && [
              "group-hover:tw-visible group-hover:tw-opacity-100",
              "group-focus:tw-visible group-focus:tw-opacity-100",
              "md:tw-opacity-0 md:tw-invisible tw-duration-0",
            ],
          )}
        >
          {windowInnerWidth > breakpointsValues.md ? (
            `En savoir plus`
          ) : (
            <span className={fr.cx("fr-icon--sm", "fr-icon-question-line")}></span>
          )}
        </span>
      </button>

      {actor && <span className="tw-col-start-2 md:tw-col-start-3 tw-pl-3">{actor}</span>}

      <div
        aria-hidden={value === undefined}
        className={classNames("tw-flex", "tw-items-center", "tw-justify-end", "tw-col-start-4")}
      >
        {value !== undefined && (
          <div
            className={classNames(
              "tw-py-1",
              isTotal && "tw-font-bold",
              getPositiveNegativeTextClassesFromValue(value),
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

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
  ImpactFormatType,
} from "../../../shared/formatImpactValue";

export type ImpactRowValueProps = {
  value?: number;
  actor?: string;
  label: string;
  isTotal?: boolean;
  onToggleAccordion?: (e?: MouseEvent<HTMLElement>) => void;
  isAccordionOpened?: boolean;
  buttonInfoAlwaysDisplayed?: boolean;
  type: ImpactFormatType | undefined;
  labelProps: HtmlHTMLAttributes<HTMLButtonElement> & { "data-fr-opened"?: boolean };
};

const impactTypeFormatterMap = {
  co2: formatCO2Impact,
  monetary: formatMonetaryImpact,
  surface_area: formatSurfaceAreaImpact,
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
        "grid",
        `grid-cols-[2rem_1fr_3rem]`,
        `md:grid-cols-[2rem_1fr_9rem_8rem]`,
        "relative",
        "items-center",
        "group",
      )}
    >
      {onToggleAccordion && (
        <Button
          className={classNames(
            "col-start-1",
            "text-black dark:text-white",
            "text-xl",
            "absolute",
            "-left-2",
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
          "col-start-2",
          !actor && "md:col-end-4",
          isTotal && "font-bold",
          "text-left",
          "group-hover:font-bold",
          "group-focus:font-bold",
          "group-hover:!bg-inherit",
          "group-focus:!bg-inherit",
          "group",
          labelClassNames,
        )}
        {...labelPropsRest}
      >
        {label}
        <span
          className={classNames(
            "fr-link",
            "fr-link--sm",
            "md:ml-2",
            "px-2",
            "transition-opacity",
            "ease-in",
            "duration-50",
            "font-normal",
            !buttonInfoAlwaysDisplayed && [
              "group-hover:visible group-hover:opacity-100",
              "group-focus:visible group-focus:opacity-100",
              "md:opacity-0 md:invisible duration-0",
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

      {actor && <span className="col-start-2 md:col-start-3 pl-3">{actor}</span>}

      <div
        aria-hidden={value === undefined}
        className={classNames("flex", "items-center", "justify-end", "col-start-4")}
      >
        {value !== undefined && (
          <div
            className={classNames(
              "py-1",
              isTotal && "font-bold",
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

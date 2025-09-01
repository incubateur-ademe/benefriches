import { ReactNode } from "react";

import { formatNumberFr } from "@/shared/core/format-number/formatNumber";

import { getPositiveNegativeTextClassesFromValue } from "../../classes/positiveNegativeTextClasses";
import classNames from "../../clsx";
import InfoTooltip from "../InfoTooltip/InfoTooltip";

type Value =
  | {
      style?: "default";
      value: ReactNode;
    }
  | {
      style: "monetary";
      value: number;
    };
type DataLineProps = {
  label: ReactNode;
  labelTooltip?: string;
  valueTooltip?: string;
  isDetails?: boolean;
  noBorder?: boolean;
  className?: string;
} & Value;

export default function DataLine({
  label,
  value,
  labelTooltip,
  valueTooltip,
  className = "",
  isDetails = false,
  noBorder = false,
  style,
}: DataLineProps) {
  const bordersClasses = isDetails
    ? ["border-l-black", "border-l"]
    : ["border-b", "border-border-grey"];
  const classes = classNames(
    "grid",
    "grid-cols-[8fr_4fr]",
    "px-0",
    "border-0",
    "border-solid",
    !noBorder && bordersClasses,
    className,
  );
  return (
    <dl className={classes}>
      <dd className={classNames("ml-0", "px-0", "py-2", isDetails && "pl-4")}>
        {label}
        {labelTooltip && <InfoTooltip title={labelTooltip} />}
      </dd>
      <dt
        className={classNames(
          "p-2",

          "sm:text-right",
          "bg-grey-light",
          "dark:bg-grey-dark",
        )}
      >
        <span
          className={classNames(
            style === "monetary" && getPositiveNegativeTextClassesFromValue(value),
            style === "monetary" && !isDetails && "font-bold",
          )}
        >
          {style === "monetary"
            ? formatNumberFr(value, {
                maximumFractionDigits: 0,
                style: "currency",
                currency: "EUR",
              })
            : value}
        </span>
        {valueTooltip && <InfoTooltip title={valueTooltip} />}
      </dt>
    </dl>
  );
}

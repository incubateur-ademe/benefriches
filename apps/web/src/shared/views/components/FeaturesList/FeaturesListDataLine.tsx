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
    ? ["tw-border-l-black", "tw-border-l"]
    : ["tw-border-b", "tw-border-borderGrey"];
  const classes = classNames(
    "tw-grid",
    "tw-grid-cols-[8fr_4fr]",
    "tw-px-0",
    "tw-border-0",
    "tw-border-solid",
    !noBorder && bordersClasses,
    className,
  );
  return (
    <dl className={classes}>
      <dd className={classNames("tw-ml-0", "tw-px-0", "tw-py-2", isDetails && "tw-pl-4")}>
        {label}
        {labelTooltip && <InfoTooltip title={labelTooltip} />}
      </dd>
      <dt
        className={classNames(
          "tw-p-2",

          "sm:tw-text-right",
          "tw-bg-grey-light",
          "dark:tw-bg-grey-dark",
        )}
      >
        <span
          className={classNames(
            style === "monetary" && getPositiveNegativeTextClassesFromValue(value),
            style === "monetary" && !isDetails && "tw-font-bold",
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

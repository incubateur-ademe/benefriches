import {
  formatCO2Impact,
  formatDefaultImpact,
  formatMonetaryImpact,
  formatSurfaceAreaImpact,
} from "../../shared/formatImpactValue";

import classNames from "@/shared/views/clsx";

const impactTypeFormatterMap = {
  co2: formatCO2Impact,
  monetary: formatMonetaryImpact,
  surfaceArea: formatSurfaceAreaImpact,
  default: formatDefaultImpact,
} as const;

type Props = {
  value: number;
  isTotal?: boolean;
  type?: keyof typeof impactTypeFormatterMap;
};

const ImpactValue = ({ value, type = "default", isTotal = false }: Props) => {
  return (
    <div
      className={classNames(
        "tw-w-48",
        "tw-p-2",
        "tw-text-center",
        "tw-bg-impacts-main",
        "dark:tw-bg-darkGrey",
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
  );
};

export default ImpactValue;

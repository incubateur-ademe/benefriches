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
        isTotal && "tw-font-bold",
        value === 0
          ? "tw-text-impacts-neutral"
          : value > 0
            ? "tw-text-impacts-positive"
            : "tw-text-impacts-negative",
      )}
    >
      {impactTypeFormatterMap[type](value)}
    </div>
  );
};

export default ImpactValue;

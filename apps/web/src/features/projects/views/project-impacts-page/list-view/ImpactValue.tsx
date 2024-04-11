import {
  formatCO2Impact,
  formatDefaultImpact,
  formatMonetaryImpact,
  formatSurfaceAreaImpact,
} from "../../shared/formatImpactValue";

import { impactColors } from "@/app/views/theme";

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
  const color =
    value === 0 ? impactColors.neutral : value > 0 ? impactColors.positive : impactColors.negative;
  return (
    <div
      style={{
        padding: "0.5rem",
        width: "200px",
        background: "#ECF5FD",
        textAlign: "center",
        fontWeight: isTotal ? "700" : "normal",
        color,
      }}
    >
      {impactTypeFormatterMap[type](value)}
    </div>
  );
};

export default ImpactValue;

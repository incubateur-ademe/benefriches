import { roundToInteger } from "shared";

import {
  formatNumberFr,
  formatPercentage,
  SQUARE_METERS_HTML_SYMBOL,
} from "@/shared/core/format-number/formatNumber";

export { formatCO2Impact, formatMonetaryImpact } from "shared";

const NO_BREAK_SPACE = " ";

export type ImpactFormatType = "monetary" | "co2" | "surface_area" | "etp" | "time" | "default";

// "monetary" and "co2" are formatted by the shared formatMonetaryImpact and formatCO2Impact.
type LocalImpactFormatType = Exclude<ImpactFormatType, "monetary" | "co2">;

type ImpactFormatConfig = Record<
  LocalImpactFormatType,
  {
    unitSuffix: string;
    maximumFractionDigits: number;
  }
>;

const impactFormatConfig = {
  surface_area: {
    maximumFractionDigits: 1,
    unitSuffix: `${NO_BREAK_SPACE}${SQUARE_METERS_HTML_SYMBOL}`,
  },
  etp: {
    maximumFractionDigits: 1,
    unitSuffix: "",
  },
  time: {
    maximumFractionDigits: 0,
    unitSuffix: `${NO_BREAK_SPACE}h`,
  },
  default: {
    maximumFractionDigits: 0,
    unitSuffix: "",
  },
} as const satisfies ImpactFormatConfig;

const getSignPrefix = (value: number) => {
  return value > 0 ? "+" : "";
};

const formatImpactValue =
  (formatType: LocalImpactFormatType) =>
  (impactValue: number, { withSignPrefix } = { withSignPrefix: true }) => {
    const { maximumFractionDigits, unitSuffix } = impactFormatConfig[formatType];

    return `${formatNumberFr(impactValue, {
      signDisplay: withSignPrefix ? "exceptZero" : "never",
      maximumFractionDigits,
    })}${unitSuffix}`;
  };

export const formatDefaultImpact = formatImpactValue("default");
export const formatSurfaceAreaImpact = formatImpactValue("surface_area");
export const formatETPImpact = formatImpactValue("etp");
export const formatTimeImpact = formatImpactValue("time");

export const formatEvolutionPercentage = (evolutionInPercentage: number) => {
  const roundedValue = roundToInteger(evolutionInPercentage);
  const prefix = getSignPrefix(evolutionInPercentage);

  return `${prefix}${formatPercentage(roundedValue)}`;
};

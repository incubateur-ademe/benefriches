import { roundToInteger } from "shared";

import {
  formatNumberFr,
  formatPercentage,
  SQUARE_METERS_HTML_SYMBOL,
} from "@/shared/core/format-number/formatNumber";

const NO_BREAK_SPACE = "\u00A0";

export type ImpactFormatType = "monetary" | "co2" | "surface_area" | "etp" | "time" | "default";

type ImpactFormatConfig = Record<
  ImpactFormatType,
  {
    unitSuffix: string;
    maximumFractionDigits: number;
  }
>;

const impactFormatConfig = {
  monetary: {
    maximumFractionDigits: 0,
    unitSuffix: `${NO_BREAK_SPACE}€`,
  },
  co2: {
    maximumFractionDigits: 1,
    unitSuffix: `${NO_BREAK_SPACE}t`,
  },
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
  (formatType: ImpactFormatType) =>
  (impactValue: number, { withSignPrefix } = { withSignPrefix: true }) => {
    const { maximumFractionDigits, unitSuffix } = impactFormatConfig[formatType];

    return `${formatNumberFr(impactValue, {
      signDisplay: withSignPrefix ? "exceptZero" : "never",
      maximumFractionDigits,
    })}${unitSuffix}`;
  };

export const formatDefaultImpact = formatImpactValue("default");
export const formatMonetaryImpact = formatImpactValue("monetary");
export const formatSurfaceAreaImpact = formatImpactValue("surface_area");
export const formatCO2Impact = formatImpactValue("co2");
export const formatETPImpact = formatImpactValue("etp");
export const formatTimeImpact = formatImpactValue("time");

export const formatEvolutionPercentage = (evolutionInPercentage: number) => {
  const roundedValue = roundToInteger(evolutionInPercentage);
  const prefix = getSignPrefix(evolutionInPercentage);

  return `${prefix}${formatPercentage(roundedValue)}`;
};

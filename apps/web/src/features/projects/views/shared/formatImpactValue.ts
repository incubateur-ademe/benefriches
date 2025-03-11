import { roundTo1Digit, roundTo2Digits, roundToInteger } from "shared";

import {
  formatNumberFr,
  formatPercentage,
  SQUARE_METERS_HTML_SYMBOL,
} from "@/shared/core/format-number/formatNumber";

const NO_BREAK_SPACE = "\u00A0";

type ImpactFormatType = "monetary" | "co2" | "surface_area" | "etp" | "time" | "default";

type ImpactFormatConfig = Record<
  ImpactFormatType,
  {
    unitSuffix: string;
    roundFn: typeof roundTo1Digit | typeof roundTo2Digits;
  }
>;

const impactFormatConfig: ImpactFormatConfig = {
  monetary: {
    roundFn: roundToInteger,
    unitSuffix: `${NO_BREAK_SPACE}€`,
  },
  co2: {
    roundFn: roundTo1Digit,
    unitSuffix: `${NO_BREAK_SPACE}t`,
  },
  surface_area: {
    roundFn: roundTo1Digit,
    unitSuffix: `${NO_BREAK_SPACE}${SQUARE_METERS_HTML_SYMBOL}`,
  },
  etp: {
    roundFn: roundTo1Digit,
    unitSuffix: "",
  },
  time: {
    roundFn: roundToInteger,
    unitSuffix: `${NO_BREAK_SPACE}h`,
  },
  default: {
    roundFn: roundToInteger,
    unitSuffix: "",
  },
} as const;

const getSignPrefix = (value: number) => {
  return value > 0 ? "+" : "";
};

const formatImpactValue =
  (formatType: ImpactFormatType) =>
  (impactValue: number, { withSignPrefix } = { withSignPrefix: true }) => {
    const { roundFn, unitSuffix } = impactFormatConfig[formatType];

    const roundedValue = roundFn(impactValue);
    const prefix = withSignPrefix ? getSignPrefix(impactValue) : "";

    return `${prefix}${formatNumberFr(roundedValue)}${unitSuffix}`;
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

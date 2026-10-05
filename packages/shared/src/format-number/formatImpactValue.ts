import { formatNumberFr } from "./formatNumber";

const NO_BREAK_SPACE = " ";

const formatImpactValue =
  (unitSuffix: string, maximumFractionDigits: number) =>
  (impactValue: number, { withSignPrefix } = { withSignPrefix: true }): string =>
    `${formatNumberFr(impactValue, {
      signDisplay: withSignPrefix ? "exceptZero" : "never",
      maximumFractionDigits,
    })}${unitSuffix}`;

export const formatMonetaryImpact = formatImpactValue(`${NO_BREAK_SPACE}€`, 0);
export const formatCO2Impact = formatImpactValue(`${NO_BREAK_SPACE}t`, 1);

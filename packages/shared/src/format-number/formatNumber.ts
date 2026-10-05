import { roundTo1Digit, roundToInteger } from "../services";

export const formatNumberFr = (
  n: number,
  options: Intl.NumberFormatOptions = { maximumFractionDigits: 2 },
): string => {
  if (isNaN(n)) {
    return "Valeur invalide";
  }

  return new Intl.NumberFormat("fr-FR", options).format(n);
};

export const SQUARE_METERS_HTML_SYMBOL = "㎡";

export const formatSurfaceArea = (surfaceArea: number): string =>
  `${formatNumberFr(surfaceArea)} ${SQUARE_METERS_HTML_SYMBOL}`;

export const formatPercentage = (percentage: number): string =>
  `${formatNumberFr(roundToInteger(percentage))}%`;

export const formatPerFrenchPersonAnnualEquivalent = (personsNumber: number): string => {
  const roundFn = personsNumber > 1 ? roundToInteger : roundTo1Digit;
  return formatNumberFr(roundFn(personsNumber));
};

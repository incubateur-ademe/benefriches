import { roundToInteger } from "shared";

export function formatNumberFr(n: number, maximumFractionDigits: number = 2): string {
  if (isNaN(n)) {
    return "Valeur invalide";
  }

  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits }).format(n);
}

export const SQUARE_METERS_HTML_SYMBOL = "㎡";
export function formatSurfaceArea(surfaceArea: number): string {
  return `${formatNumberFr(surfaceArea)} ${SQUARE_METERS_HTML_SYMBOL}`;
}

export function formatPercentage(percentage: number): string {
  const roundedValue = roundToInteger(percentage);

  return `${formatNumberFr(roundedValue)}%`;
}

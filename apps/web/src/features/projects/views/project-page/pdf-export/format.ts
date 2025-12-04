import { roundToInteger } from "shared";

import {
  formatNumberFr,
  formatSurfaceArea,
  SQUARE_METERS_HTML_SYMBOL,
} from "@/shared/core/format-number/formatNumber";

import {
  formatCO2Impact,
  formatDefaultImpact,
  formatETPImpact,
  formatMonetaryImpact,
  formatSurfaceAreaImpact,
  formatTimeImpact,
} from "../../shared/formatImpactValue";

const replaceNonBreakingSpacePdf = (str: string): string => {
  // non-breaking space is rendered as '/' in PDF-kit
  // see https://github.com/foliojs/pdfkit/issues/1331
  // eslint-disable-next-line no-irregular-whitespace
  return str.replace(/[\u00A0\u1680​\u180e\u2000-\u2009\u200a​\u200b​\u202f\u205f​\u3000]/g, " ");
};

const replaceSquareMetersHtmlSymbolPdf = (str: string): string => {
  // PDF does not handle the HTML symbol for square meters
  return str.replace(SQUARE_METERS_HTML_SYMBOL, "m²");
};

export const formatNumberPdf = (number: number): string => {
  return replaceNonBreakingSpacePdf(formatNumberFr(number));
};

export const formatSurfaceAreaPdf = (surfaceArea: number): string => {
  const roundedSurfaceArea = roundToInteger(surfaceArea);
  const formattedSurfaceArea = formatSurfaceArea(roundedSurfaceArea);
  return replaceSquareMetersHtmlSymbolPdf(replaceNonBreakingSpacePdf(formattedSurfaceArea));
};

export const formatMoneyPdf = (amount: number): string => {
  return `${formatNumberPdf(amount)} €`;
};

export const formatDefaultImpactPdf = (impactValue: number): string => {
  return replaceNonBreakingSpacePdf(formatDefaultImpact(impactValue));
};

export const formatMonetaryImpactPdf = (impactValue: number): string => {
  return replaceNonBreakingSpacePdf(formatMonetaryImpact(impactValue));
};

export const formatSurfaceAreaImpactPdf = (impactValue: number): string =>
  replaceSquareMetersHtmlSymbolPdf(
    replaceNonBreakingSpacePdf(formatSurfaceAreaImpact(roundToInteger(impactValue))),
  );

export const formatCO2ImpactPdf = (impactValue: number): string =>
  replaceNonBreakingSpacePdf(formatCO2Impact(impactValue));

export const formatETPImpactPdf = (impactValue: number): string =>
  replaceNonBreakingSpacePdf(formatETPImpact(impactValue));

export const formatTimeImpactPdf = (impactValue: number): string =>
  replaceNonBreakingSpacePdf(formatTimeImpact(impactValue));

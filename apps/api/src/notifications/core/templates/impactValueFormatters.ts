// Number formatters of the project impacts summary, reproduced from the web app so the email's
// card values read exactly like the Synthèse's:
// - apps/web/src/shared/core/format-number/formatNumber.ts (formatNumberFr, formatSurfaceArea,
//   formatPercentage)
// - apps/web/src/features/projects/views/shared/formatImpactValue.ts (formatMonetaryImpact,
//   formatCO2Impact)
// - apps/web/src/shared/core/format-number/formatCarbonStorage.ts
//   (formatPerFrenchPersonAnnualEquivalent)
// - apps/web/src/shared/core/carbonEmissions.ts
//   (getCo2EqEmissionsTonsInAverageFrenchAnnualEmissionsPerPerson)
// Copied rather than moved to shared (plan D4): the web has dozens of importers. Keep them in
// step with the web: the expected strings in the spec are the web's outputs.
import { roundTo1Digit, roundToInteger } from "shared";

const NO_BREAK_SPACE = " ";
const SQUARE_METERS_SYMBOL = "㎡";
const AVERAGE_FRENCH_ANNUAL_EMISSIONS_TON_CO2_EQ_PER_PERSON = 9.2;

export const formatNumberFr = (
  n: number,
  options: Intl.NumberFormatOptions = { maximumFractionDigits: 2 },
): string => {
  if (isNaN(n)) {
    return "Valeur invalide";
  }
  return new Intl.NumberFormat("fr-FR", options).format(n);
};

export const formatMonetaryImpact = (value: number): string =>
  `${formatNumberFr(value, { signDisplay: "exceptZero", maximumFractionDigits: 0 })}${NO_BREAK_SPACE}€`;

// The web's formatCO2Impact(value, { withSignPrefix: false }): the only use in the Synthèse.
export const formatCO2Impact = (value: number): string =>
  `${formatNumberFr(value, { signDisplay: "never", maximumFractionDigits: 1 })}${NO_BREAK_SPACE}t`;

// A regular space before the unit, as in the web.
export const formatSurfaceArea = (value: number): string =>
  `${formatNumberFr(value)} ${SQUARE_METERS_SYMBOL}`;

export const formatPercentage = (value: number): string =>
  `${formatNumberFr(roundToInteger(value))}%`;

export const formatPerFrenchPersonAnnualEquivalent = (persons: number): string => {
  const roundFn = persons > 1 ? roundToInteger : roundTo1Digit;
  return formatNumberFr(roundFn(persons));
};

export const getCo2EqEmissionsTonsInAverageFrenchAnnualEmissionsPerPerson = (
  co2EqEmissionsTons: number,
): number => co2EqEmissionsTons / AVERAGE_FRENCH_ANNUAL_EMISSIONS_TON_CO2_EQ_PER_PERSON;

import { formatNumberFr, roundTo1Digit, roundToInteger } from "shared";

export { formatPerFrenchPersonAnnualEquivalent } from "shared";

export const formatCarbonStorage = (carbonStorageInTons: number): string => {
  const roundFn = carbonStorageInTons > 1 ? roundToInteger : roundTo1Digit;
  return formatNumberFr(roundFn(carbonStorageInTons));
};

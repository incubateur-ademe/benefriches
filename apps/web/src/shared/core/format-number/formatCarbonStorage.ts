import { roundTo1Digit, roundToInteger } from "shared";

import { formatNumberFr } from "@/shared/core/format-number/formatNumber";

export const formatCarbonStorage = (carbonStorageInTons: number): string => {
  const roundFn = carbonStorageInTons > 1 ? roundToInteger : roundTo1Digit;
  return formatNumberFr(roundFn(carbonStorageInTons));
};

export const formatPerFrenchPersonAnnualEquivalent = (personsNumber: number): string => {
  const roundFn = personsNumber > 1 ? roundToInteger : roundTo1Digit;
  return formatNumberFr(roundFn(personsNumber));
};

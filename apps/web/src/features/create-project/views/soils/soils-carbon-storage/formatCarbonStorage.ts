import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import { roundTo1Digit, roundToInteger } from "@/shared/services/round-numbers/roundNumbers";

export const formatCarbonStorage = (carbonStorageInTons: number): string => {
  const roundFn = carbonStorageInTons > 1 ? roundToInteger : roundTo1Digit;
  return formatNumberFr(roundFn(carbonStorageInTons));
};

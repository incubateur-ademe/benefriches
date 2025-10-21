import { roundTo2Digits } from "shared";

// splits a number with a 2-digit precision (100 split in 3 parts will be [33.33, 33.33, 33.34])
export function splitEvenly(total: number, parts: number): number[] {
  if (total === 0 || parts === 0) return [0];
  if (parts === 1) return [total];

  const splitValue = roundTo2Digits(total / parts);
  const remainder = total - splitValue * (parts - 1);

  // oxlint-disable-next-line no-new-array
  return new Array<number>(parts - 1).fill(splitValue).concat(remainder);
}

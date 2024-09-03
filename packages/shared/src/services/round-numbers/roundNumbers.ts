export const roundTo2Digits = (value: number): number => {
  return Math.round(value * 100) / 100;
};

export const roundTo1Digit = (value: number): number => {
  return Math.round(value * 10) / 10;
};

export const roundToInteger = (value: number): number => {
  return Math.round(value);
};

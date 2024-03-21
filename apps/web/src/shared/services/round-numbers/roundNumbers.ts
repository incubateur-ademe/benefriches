export const roundTo2Digits = (value: number) => {
  return Math.round(value * 100) / 100;
};

export const roundTo1Digit = (value: number) => {
  return Math.round(value * 10) / 10;
};

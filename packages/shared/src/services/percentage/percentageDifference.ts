export const getPercentageDifference = (base: number, evolution: number) => {
  if (isNaN(base) || isNaN(evolution)) return 0;

  if (base === 0) return 100;

  return ((evolution - base) * 100) / base;
};

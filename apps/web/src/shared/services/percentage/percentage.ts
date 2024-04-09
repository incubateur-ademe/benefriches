export const getPercentage = (part: number, total: number) => {
  if (isNaN(part) || !total) return 0;
  return (part * 100) / total;
};

export const getPercentageDifference = (base: number, evolution: number) => {
  if (isNaN(base) || isNaN(evolution)) return 0;

  if (base === 0) return 100;

  return ((evolution - base) * 100) / base;
};

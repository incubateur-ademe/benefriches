export const computePercentage = (part: number, total: number) => {
  if (isNaN(part) || isNaN(total) || total === 0) return 0;

  return (part / total) * 100;
};

export const computeValueFromPercentage = (percentage: number, total: number) => {
  if (isNaN(percentage) || isNaN(total)) return 0;

  return (percentage / 100) * total;
};

export const getPercentage = (part: number, total: number) => {
  if (isNaN(part) || !total) return 0;
  return (part * 100) / total;
};

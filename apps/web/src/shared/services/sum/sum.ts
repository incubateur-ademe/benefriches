export const sumObjectValues = (obj: Record<string, number>) => {
  return Object.values(obj)
    .filter((amount) => !!amount)
    .reduce((sum, amount) => sum + amount, 0);
};

export const getPositiveNegativeTextClassesFromValue = (value: number) => {
  if (value === 0) {
    return "text-impacts-neutral-main dark:text-impacts-neutral-light";
  }
  return value > 0
    ? "text-impacts-positive-main dark:text-impacts-positive-light"
    : "text-impacts-negative-main dark:text-impacts-negative-light";
};

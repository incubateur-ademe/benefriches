export const getPositiveNegativeTextClassesFromValue = (value: number) => {
  if (value === 0) {
    return "tw-text-impacts-neutral-main dark:tw-text-impacts-neutral-light";
  }
  return value > 0
    ? "tw-text-impacts-positive-main dark:tw-text-impacts-positive-light"
    : "tw-text-impacts-negative-main dark:tw-text-impacts-negative-light";
};

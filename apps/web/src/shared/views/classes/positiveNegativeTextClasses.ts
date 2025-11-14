export const getPositiveNegativeTextClassesFromValue = (value: number) => {
  if (value === 0) {
    return "text-text-dark dark:text-grey-light";
  }
  return value > 0
    ? "text-success-ultradark dark:text-success-ultralight"
    : "text-error-ultradark dark:text-error-ultralight";
};

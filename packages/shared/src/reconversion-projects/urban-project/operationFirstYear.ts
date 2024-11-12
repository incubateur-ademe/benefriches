export const computeDefaultOperationsFirstYear = (installationEndDate: Date): number => {
  return installationEndDate.getFullYear() + 1;
};

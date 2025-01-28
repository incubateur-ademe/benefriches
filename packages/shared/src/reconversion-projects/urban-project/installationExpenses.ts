export type ComputedInstallationExpenses = {
  technicalStudies: number;
  developmentWorks: number;
  other: number;
};

export const computeDefaultInstallationExpensesFromSiteSurfaceArea = (
  surfaceArea: number,
): ComputedInstallationExpenses => {
  const technicalStudies = surfaceArea * 6;
  const developmentWorks = surfaceArea * 54;
  const other = (technicalStudies + developmentWorks) * 0.09;
  return { technicalStudies, developmentWorks, other };
};

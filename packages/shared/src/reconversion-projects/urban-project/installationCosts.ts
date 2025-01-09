export type ComputedInstallationCosts = {
  technicalStudies: number;
  developmentWorks: number;
  other: number;
};

export const computeDefaultInstallationCostsFromSiteSurfaceArea = (
  surfaceArea: number,
): { technicalStudies: number; developmentWorks: number; other: number } => {
  const technicalStudies = surfaceArea * 6;
  const developmentWorks = surfaceArea * 54;
  const other = (technicalStudies + developmentWorks) * 0.09;
  return { technicalStudies, developmentWorks, other };
};

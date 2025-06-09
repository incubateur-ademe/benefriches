import { TExpense } from "../../financial";

export type UrbanProjectDevelopmentExpense = TExpense<
  "technical_studies" | "development_works" | "other"
>;

export type ComputedInstallationExpenses = {
  technicalStudies: number;
  developmentWorks: number;
  other: number;
};

export const URBAN_PROJECT_EURO_PER_SQUARE_METERS_FOR_TECHNICAL_STUDIES = 6;
export const URBAN_PROJECT_EURO_PER_SQUARE_METERS_FOR_DEVELOPMENT_WORKS = 54;

export const computeDefaultInstallationExpensesFromSiteSurfaceArea = (
  surfaceArea: number,
): ComputedInstallationExpenses => {
  const technicalStudies = surfaceArea * 6;
  const developmentWorks = surfaceArea * 54;
  const other = (technicalStudies + developmentWorks) * 0.09;
  return { technicalStudies, developmentWorks, other };
};

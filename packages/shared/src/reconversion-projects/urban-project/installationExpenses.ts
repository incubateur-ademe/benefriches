import { TExpense } from "../../financial";
import { roundToInteger } from "../../services";

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
  const technicalStudies = roundToInteger(surfaceArea * 6);
  const developmentWorks = roundToInteger(surfaceArea * 54);
  const other = roundToInteger((technicalStudies + developmentWorks) * 0.09);
  return { technicalStudies, developmentWorks, other };
};

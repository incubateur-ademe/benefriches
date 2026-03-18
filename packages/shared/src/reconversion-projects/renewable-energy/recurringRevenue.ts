import { TRevenue } from "../../financial";

export type RecurringRevenue = TRevenue<"operations" | "other" | "rent">;

// All data from Comité de régulation de l'énergie 2026
const ECONOMICAL_RATIO_OPERATIONS_INCOME_EURO_PER_MWH_PER_YEAR = 75;
export const computeDefaultPhotovoltaicYearlyRecurringRevenueAmount = (
  expectedProductionMWh: number,
) => {
  return Math.round(
    expectedProductionMWh * ECONOMICAL_RATIO_OPERATIONS_INCOME_EURO_PER_MWH_PER_YEAR,
  );
};

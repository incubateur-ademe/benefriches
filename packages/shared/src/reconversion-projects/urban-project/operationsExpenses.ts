import z from "zod";

import type { TExpense } from "../../financial";

export const yearlyBuildingsOperationsExpensePurposeSchema = z.enum([
  "maintenance",
  "taxes",
  "other",
]);
export type YearlyBuildingsOperationsExpenses = TExpense<
  z.infer<typeof yearlyBuildingsOperationsExpensePurposeSchema>
>;

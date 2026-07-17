import { yearlyBuildingsOperationsExpensePurposeSchema } from "shared";
import z from "zod";

export const expensesProjectedBuildingsOperatingExpensesSchema = z.object({
  yearlyProjectedBuildingsOperationsExpenses: z.array(
    z.object({
      amount: z.number().nonnegative(),
      purpose: yearlyBuildingsOperationsExpensePurposeSchema,
    }),
  ),
});

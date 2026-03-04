import z from "zod";

const recurringExpensePurposeSchema = z.enum(["rent", "maintenance", "taxes", "other"]);

export const expensesYearlyProjectedExpensesSchema = z.object({
  yearlyProjectedExpenses: z.array(
    z.object({ amount: z.number(), purpose: recurringExpensePurposeSchema }),
  ),
});

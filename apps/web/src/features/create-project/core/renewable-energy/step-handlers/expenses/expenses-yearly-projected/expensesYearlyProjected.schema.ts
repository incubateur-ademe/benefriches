import z from "zod";

export const expensesYearlyProjectedExpensesSchema = z.object({
  yearlyProjectedExpenses: z.array(z.object({ amount: z.number(), purpose: z.string() })),
});

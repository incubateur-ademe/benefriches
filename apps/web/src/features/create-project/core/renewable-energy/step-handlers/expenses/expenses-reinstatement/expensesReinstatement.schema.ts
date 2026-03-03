import { reinstatementExpensesPurposeSchema } from "shared";
import z from "zod";

export const expensesReinstatementSchema = z.object({
  reinstatementExpenses: z.array(
    z.object({ amount: z.number(), purpose: reinstatementExpensesPurposeSchema }),
  ),
});

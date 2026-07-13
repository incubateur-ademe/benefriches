import { financialAssistanceRevenueSourceSchema } from "shared";
import z from "zod";

export const revenueFinancialAssistanceSchema = z.object({
  financialAssistanceRevenues: z.array(
    z.object({
      amount: z.number().nonnegative(),
      source: financialAssistanceRevenueSourceSchema,
    }),
  ),
});

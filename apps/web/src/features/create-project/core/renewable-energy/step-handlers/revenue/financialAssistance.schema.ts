import z from "zod";

export const revenueFinancialAssistanceSchema = z.object({
  financialAssistanceRevenues: z.array(z.object({ amount: z.number(), source: z.string() })),
});

import z from "zod";

export const revenueYearlyProjectedRevenueSchema = z.object({
  yearlyProjectedRevenues: z.array(z.object({ amount: z.number(), source: z.string() })),
});

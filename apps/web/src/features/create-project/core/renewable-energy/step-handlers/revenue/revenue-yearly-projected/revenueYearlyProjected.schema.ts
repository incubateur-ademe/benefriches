import z from "zod";

const recurringRevenueSourceSchema = z.enum(["operations", "other", "rent"]);

export const revenueYearlyProjectedRevenueSchema = z.object({
  yearlyProjectedRevenues: z.array(
    z.object({ amount: z.number(), source: recurringRevenueSourceSchema }),
  ),
});

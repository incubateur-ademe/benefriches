import { z } from "zod";

export const siteYearlyIncomeSchema = z.object({
  source: z.enum(["operations", "product-sales", "subsidies", "other", "rent"]),
  amount: z.number().nonnegative(),
});

export type SiteYearlyIncome = z.infer<typeof siteYearlyIncomeSchema>;

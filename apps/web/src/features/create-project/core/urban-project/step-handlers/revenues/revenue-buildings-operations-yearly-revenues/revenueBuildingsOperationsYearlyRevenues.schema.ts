import { yearlyBuildingsOperationsRevenuePurposeSchema } from "shared";
import z from "zod";

export const revenueBuildingsOperationsYearlyRevenuesSchema = z.object({
  yearlyProjectedRevenues: z.array(
    z.object({
      amount: z.number().nonnegative(),
      source: yearlyBuildingsOperationsRevenuePurposeSchema,
    }),
  ),
});

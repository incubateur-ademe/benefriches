import { urbanProjectDevelopmentExpensePurposeSchema } from "shared";
import z from "zod";

export const expensesInstallationSchema = z.object({
  installationExpenses: z.array(
    z.object({
      amount: z.number().nonnegative(),
      purpose: urbanProjectDevelopmentExpensePurposeSchema,
    }),
  ),
});

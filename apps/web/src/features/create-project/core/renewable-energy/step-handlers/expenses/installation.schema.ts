import z from "zod";

export const expensesInstallationSchema = z.object({
  photovoltaicPanelsInstallationExpenses: z.array(
    z.object({ amount: z.number(), purpose: z.string() }),
  ),
});

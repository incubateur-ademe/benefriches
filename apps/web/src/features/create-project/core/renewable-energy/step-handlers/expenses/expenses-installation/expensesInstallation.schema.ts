import z from "zod";

const photovoltaicInstallationExpensePurposeSchema = z.enum([
  "technical_studies",
  "installation_works",
  "other",
]);

export const expensesInstallationSchema = z.object({
  photovoltaicPanelsInstallationExpenses: z.array(
    z.object({ amount: z.number(), purpose: photovoltaicInstallationExpensePurposeSchema }),
  ),
});

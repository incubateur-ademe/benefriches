import z from "zod";

export const localAuthorityExpensesSchema = z.object({
  // A la charge de la collectivite
  maintenance: z.number().nonnegative().optional(),
  otherManagementCosts: z.number().nonnegative().optional(),
});

export type LocalAuthorityExpenses = z.infer<typeof localAuthorityExpensesSchema>;

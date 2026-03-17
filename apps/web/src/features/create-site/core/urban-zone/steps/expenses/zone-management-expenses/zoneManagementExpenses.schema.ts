import z from "zod";

export const zoneManagementExpensesSchema = z.object({
  // A la charge du gestionnaire de parc d'activite
  maintenance: z.number().nonnegative().optional(),
  security: z.number().nonnegative().optional(),
  illegalDumpingCost: z.number().nonnegative().optional(),
  otherManagementCosts: z.number().nonnegative().optional(),
});

export type ZoneManagementExpenses = z.infer<typeof zoneManagementExpensesSchema>;

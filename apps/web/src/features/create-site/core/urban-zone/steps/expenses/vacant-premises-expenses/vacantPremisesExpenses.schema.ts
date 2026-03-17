import z from "zod";

export const vacantPremisesExpensesSchema = z.object({
  // A la charge du gestionnaire de parc d'activite
  ownerPropertyTaxes: z.number().nonnegative().optional(),
  ownerMaintenance: z.number().nonnegative().optional(),
  ownerSecurity: z.number().nonnegative().optional(),
  ownerIllegalDumpingCost: z.number().nonnegative().optional(),
  ownerOtherManagementCosts: z.number().nonnegative().optional(),
  // A la charge du locataire
  tenantRent: z.number().nonnegative().optional(),
  tenantOperationsTaxes: z.number().nonnegative().optional(),
  tenantOtherOperationsCosts: z.number().nonnegative().optional(),
});

export type VacantPremisesExpenses = z.infer<typeof vacantPremisesExpensesSchema>;

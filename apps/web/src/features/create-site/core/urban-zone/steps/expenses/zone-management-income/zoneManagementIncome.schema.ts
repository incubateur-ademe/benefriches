import z from "zod";

export const zoneManagementIncomeSchema = z.object({
  // Au benefice du gestionnaire de parc d'activite
  rent: z.number().nonnegative().optional(),
  subsidies: z.number().nonnegative().optional(),
  otherIncome: z.number().nonnegative().optional(),
});

export type ZoneManagementIncome = z.infer<typeof zoneManagementIncomeSchema>;

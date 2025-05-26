import z from "zod";

const siteManagementYearlyExpensePurpose = z.enum([
  "rent",
  "propertyTaxes",
  "operationsTaxes",
  // utilisé pour les exploitations agricoles, car on n'a
  // qu'une valeur estimée pour la totalité des taxes et impôts
  // et pas de calculs séparés pour la taxe foncière et les charges
  // fiscales d'exploitation
  "taxes",
  "maintenance",
  "otherOperationsCosts",
  "otherManagementCosts",
]);

export type SiteManagementYearlyExpensePurpose = z.infer<typeof siteManagementYearlyExpensePurpose>;

const siteSecurityYearlyExpensePurpose = z.enum([
  "security",
  "illegalDumpingCost",
  "accidentsCost",
  "otherSecuringCosts",
]);

export type SiteSecurityYearlyExpensePurpose = z.infer<typeof siteSecurityYearlyExpensePurpose>;
export type SiteYearlyExpensePurpose =
  | SiteManagementYearlyExpensePurpose
  | SiteSecurityYearlyExpensePurpose;

export const siteYearlyExpenseSchema = z.object({
  purpose: z.union([siteManagementYearlyExpensePurpose, siteSecurityYearlyExpensePurpose]),
  amount: z.number().nonnegative(),
  bearer: z.enum(["owner", "tenant"]),
});

export type SiteYearlyExpense = z.infer<typeof siteYearlyExpenseSchema>;

export const SECURITY_COST_BY_HECTARE_PER_YEAR = 22000;
export const MAINTENANCE_COST_BY_BUILDING_SQUARE_METER_PER_YEAR = 7;
export const ILLEGAL_DUMPING_COST_PER_TON = 900;
export const ILLEGAL_DUMPING_TON_PER_INHABITANT_PER_YEAR = 0.0047;
export const ILLEGAL_DUMPING_ESTIMATED_RATIO = 1 / 100;

export const computeIllegalDumpingDefaultCost = (population: number) => {
  return Math.round(
    ILLEGAL_DUMPING_TON_PER_INHABITANT_PER_YEAR *
      population *
      ILLEGAL_DUMPING_ESTIMATED_RATIO *
      ILLEGAL_DUMPING_COST_PER_TON,
  );
};

export const computeMaintenanceDefaultCost = (buildingsSurface: number) => {
  return Math.round(MAINTENANCE_COST_BY_BUILDING_SQUARE_METER_PER_YEAR * buildingsSurface);
};

export const computeSecurityDefaultCost = (surfaceArea: number) => {
  return Math.round(SECURITY_COST_BY_HECTARE_PER_YEAR * (surfaceArea / 10000));
};

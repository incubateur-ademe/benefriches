import { z } from "zod";

export type SiteYearlyExpensePurpose =
  | "rent"
  | "propertyTaxes"
  | "operationsTaxes"
  | "maintenance"
  | "otherManagementCosts"
  | "security"
  | "illegalDumpingCost"
  | "accidentsCost"
  | "otherSecuringCosts";

export type SiteYearlyExpense = {
  purpose: SiteYearlyExpensePurpose;
  amount: number;
  bearer: "owner" | "tenant";
};

export const fricheActivitySchema = z.enum([
  "AGRICULTURE",
  "INDUSTRY",
  "MILITARY",
  "RAILWAY",
  "PORT",
  "TIP_OR_RECYCLING_SITE",
  "PUBLIC_FACILITY",
  "BUSINESS",
  "HOUSING",
  "OTHER",
]);

export type FricheActivity = z.infer<typeof fricheActivitySchema>;

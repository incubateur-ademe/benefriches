import { z } from "zod";

export type SiteManagementYearlyExpensePurpose =
  | "rent"
  | "propertyTaxes"
  | "operationsTaxes"
  | "maintenance"
  | "otherManagementCosts";

export type SiteSecurityYearlyExpensePurpose =
  | "security"
  | "illegalDumpingCost"
  | "accidentsCost"
  | "otherSecuringCosts";

export type SiteYearlyExpensePurpose =
  | SiteManagementYearlyExpensePurpose
  | SiteSecurityYearlyExpensePurpose;

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

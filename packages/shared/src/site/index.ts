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

export const fricheActivitySchema = z.enum([
  "AGRICULTURE",
  "INDUSTRY",
  "MILITARY",
  "RAILWAY",
  "PORT",
  "HOSPITAL",
  "ADMINISTRATION",
  "BUSINESS",
  "HOUSING",
  "OTHER",
]);

export type FricheActivity = z.infer<typeof fricheActivitySchema>;

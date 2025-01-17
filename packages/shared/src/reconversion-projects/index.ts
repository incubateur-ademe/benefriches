import { z } from "zod";

import { TExpense, TRevenue } from "../financial";

export const developmentPlanCategorySchema = z.enum([
  "RENEWABLE_ENERGY",
  "URBAN_PROJECT",
  "URBAN_AGRICULTURE",
  "NATURAL_URBAN_SPACES",
  "COMMERCIAL_ACTIVITY_AREA",
]);
export type DevelopmentPlanCategory = z.infer<typeof developmentPlanCategorySchema>;

export const developmentPlanTypeSchema = z.enum(["PHOTOVOLTAIC_POWER_PLANT", "URBAN_PROJECT"]);
export type DevelopmentPlanType = z.infer<typeof developmentPlanTypeSchema>;

export type ReinstatementExpensePurpose =
  | "asbestos_removal"
  | "deimpermeabilization"
  | "demolition"
  | "other_reinstatement"
  | "remediation"
  | "sustainable_soils_reinstatement"
  | "waste_collection";

type RecurringExpensePurpose = "rent" | "maintenance" | "taxes" | "other";

export type ReinstatementExpense = TExpense<ReinstatementExpensePurpose>;
export type RecurringExpense = TExpense<RecurringExpensePurpose>;

export type RecurringRevenue = TRevenue<"operations" | "other" | "rent">;
export type FinancialAssistanceRevenue = TRevenue<
  "local_or_regional_authority_participation" | "public_subsidies" | "other"
>;

export type InstallationExpense = TExpense<"technical_studies" | "development_works" | "other">;

export * from "./renewable-energy";
export * from "./reinstatement";
export * from "./urban-project";
export * from "./sitePurchase";
export * from "./reconversionProjectSchemas";

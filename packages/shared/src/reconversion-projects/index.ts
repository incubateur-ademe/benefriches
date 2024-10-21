import { z } from "zod";

import { TExpense, TRevenue } from "../financial";

export const developmentPlanCategorySchema = z.enum([
  "RENEWABLE_ENERGY",
  "URBAN_BUILDINGS",
  "URBAN_AGRICULTURE",
  "NATURAL_URBAN_SPACES",
  "COMMERCIAL_ACTIVITY_AREA",
]);
export type DevelopmentPlanCategory = z.infer<typeof developmentPlanCategorySchema>;

export const developmentPlanTypeSchema = z.enum(["PHOTOVOLTAIC_POWER_PLANT", "URBAN_BUILDINGS"]);
export type DevelopmentPlanType = z.infer<typeof developmentPlanTypeSchema>;

export type ProjectPhase =
  | "setup"
  | "planning"
  | "design"
  | "construction"
  | "completed"
  | "unknown";

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

export const scheduleSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
});
export type Schedule = z.infer<typeof scheduleSchema>;

export * from "./urbanProject";
export * from "./photovoltaicPowerStation";
export * from "./reinstatementCosts";
export * from "./reinstatementFullTimeJobs";
export * from "./green-spaces/urbanGreenSpaces";
export * from "./living-and-activity-spaces/urbanLivingAndActivitySpaces";
export * from "./public-spaces/urbanPublicSpaces";
export * from "./living-and-activity-spaces/buildingsUse";

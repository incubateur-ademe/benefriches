import z from "zod";

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

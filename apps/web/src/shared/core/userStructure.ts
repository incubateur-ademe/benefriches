import { z } from "zod";

export const userStructureActivitySchema = z.enum([
  "urban_planner",
  "real_estate_developer",
  "local_authority_landlord",
  "photovoltaic_plants_developer",
  "industrialist",
  "other",
  "municipality",
  "epci",
  "department",
  "region",
]);

export type UserStructureActivity = z.infer<typeof userStructureActivitySchema>;

export const userStructureTypeSchema = z.enum(["local_authority", "company"]);

export type UserStructureType = z.infer<typeof userStructureTypeSchema>;

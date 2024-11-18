import { z } from "zod";

const structureActivitySchema = z.enum([
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

export type UserStructureActivity = z.infer<typeof structureActivitySchema>;

const structureTypeSchema = z.enum(["local_authority", "company"]);

export type UserStructureType = z.infer<typeof structureTypeSchema>;

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  structureType: structureTypeSchema,
  structureActivity: structureActivitySchema,
  structureName: z.string().optional(),
  personalDataStorageConsented: z.boolean(),
  personalDataAnalyticsUseConsented: z.boolean(),
  personalDataCommunicationUseConsented: z.boolean(),
  createdFrom: z.enum(["demo_app", "features_app"]),
});

export type User = z.infer<typeof userSchema>;

export type UserStructure = {
  type: UserStructureType;
  activity: UserStructureActivity;
  name?: string;
};

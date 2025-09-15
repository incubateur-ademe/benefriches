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
  id: z.uuid(),
  email: z.email(),
  firstname: z.string(),
  lastname: z.string(),
  structureType: structureTypeSchema,
  structureActivity: structureActivitySchema,
  structureName: z.string().optional(),
  personalDataStorageConsented: z.boolean(),
  personalDataAnalyticsUseConsented: z.boolean(),
  personalDataCommunicationUseConsented: z.boolean(),
  subscribedToNewsletter: z.boolean(),
});

export type User = z.infer<typeof userSchema>;

export type UserStructure = {
  type: UserStructureType;
  activity: UserStructureActivity;
  name?: string;
};

export type AuthenticatedUser = {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  structureType: UserStructureType;
  structureActivity: UserStructureActivity;
  structureName?: string;
};

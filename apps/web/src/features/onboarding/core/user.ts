import { z } from "zod";

import {
  type UserStructureActivity,
  userStructureActivitySchema,
  type UserStructureType,
  userStructureTypeSchema,
} from "@/shared/core/userStructure";

export const userSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  firstName: z.string(),
  lastName: z.string(),
  structureType: userStructureTypeSchema,
  structureActivity: userStructureActivitySchema,
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
  firstName: string;
  lastName: string;
  structureType: UserStructureType;
  structureActivity: UserStructureActivity;
  structureName?: string;
  isAdmin: boolean;
};

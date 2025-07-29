import { z } from "zod";

export const userSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  structureActivity: z.string(),
  structureType: z.string(),
  structureName: z.string().optional(),
  createdAt: z.date(),
  personalDataStorageConsentedAt: z.date(),
  personalDataAnalyticsUseConsentedAt: z.date().optional(),
  personalDataCommunicationUseConsentedAt: z.date().optional(),
});

export type User = z.infer<typeof userSchema>;

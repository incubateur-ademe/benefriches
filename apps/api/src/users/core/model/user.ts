import { z } from "zod";

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  structureActivity: z.string(),
  structureType: z.string(),
  structureName: z.string().optional(),
  createdAt: z.date(),
  personalDataStorageConsentedAt: z.date(),
  personalDataAnalyticsUseConsentedAt: z.date().optional(),
  personalDataCommunicationUseConsentedAt: z.date().optional(),
  createdFrom: z.enum(["demo_app", "features_app"]),
});

export type User = z.infer<typeof userSchema>;

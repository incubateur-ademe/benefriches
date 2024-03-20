import { z } from "zod";

export const identitySchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  structureType: z.string().optional(),
  structureName: z.string().optional(),
  createdAt: z.date(),
  personalDataStorageConsentedAt: z.date(),
  personalDataAnalyticsUseConsentedAt: z.date().optional(),
  personalDataCommunicationUseConsentedAt: z.date().optional(),
});

export type Identity = z.infer<typeof identitySchema>;

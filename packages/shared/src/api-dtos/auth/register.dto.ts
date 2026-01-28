import { z } from "zod";

export const registerUserRequestDtoSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  firstname: z.string(),
  lastname: z.string(),
  structureType: z.string(),
  structureActivity: z.string(),
  structureName: z.string().optional(),
  personalDataStorageConsented: z.literal(true),
  personalDataAnalyticsUseConsented: z.boolean(),
  personalDataCommunicationUseConsented: z.boolean(),
  subscribedToNewsletter: z.boolean(),
});

export type RegisterUserRequestDto = z.infer<typeof registerUserRequestDtoSchema>;

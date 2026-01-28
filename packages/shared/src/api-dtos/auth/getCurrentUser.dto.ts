import { z } from "zod";

export const getCurrentUserResponseDtoSchema = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  structureType: z.string(),
  structureActivity: z.string(),
  structureName: z.string().optional(),
});

export type GetCurrentUserResponseDto = z.infer<typeof getCurrentUserResponseDtoSchema>;

import z from "zod";

export const namingSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
});

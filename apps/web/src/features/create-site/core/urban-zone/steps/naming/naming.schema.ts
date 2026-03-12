import z from "zod";

export const namingSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

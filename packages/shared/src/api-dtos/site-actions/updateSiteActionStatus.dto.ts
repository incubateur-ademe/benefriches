import z from "zod";

export const updateSiteActionStatusDtoSchema = z.object({
  status: z.enum(["done", "skipped"]),
});

export type UpdateSiteActionStatusDto = z.infer<typeof updateSiteActionStatusDtoSchema>;

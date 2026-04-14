import z from "zod";

export const buildingsResaleSelectionSchema = z.object({
  buildingsResalePlannedAfterDevelopment: z.boolean(),
});

import z from "zod";

import { urbanProjectCategorySchema } from "../../urban-project/project-generator/categories";

export const reconversionProjectTemplateSchema = z.enum([
  ...urbanProjectCategorySchema.exclude(["OTHER"]).options,
  "PHOTOVOLTAIC_POWER_PLANT",
]);

export type ReconversionProjectTemplate = z.infer<typeof reconversionProjectTemplateSchema>;

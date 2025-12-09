import z from "zod";

import { urbanProjectTemplateSchema } from "../../urban-project/project-generator/templates";

export const reconversionProjectTemplateSchema = z.enum([
  ...urbanProjectTemplateSchema.options,
  "PHOTOVOLTAIC_POWER_PLANT",
]);

export type ReconversionProjectTemplate = z.infer<typeof reconversionProjectTemplateSchema>;

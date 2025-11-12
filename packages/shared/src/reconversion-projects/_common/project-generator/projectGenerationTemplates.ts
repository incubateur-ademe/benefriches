import z from "zod";

import { urbanProjectTemplate } from "../../urban-project/project-generator/templates";

export const reconversionProjectTemplateSchema = z.enum([
  ...urbanProjectTemplate.options,
  "PHOTOVOLTAIC_POWER_PLANT",
]);

export type ReconversionProjectTemplate = z.infer<typeof reconversionProjectTemplateSchema>;

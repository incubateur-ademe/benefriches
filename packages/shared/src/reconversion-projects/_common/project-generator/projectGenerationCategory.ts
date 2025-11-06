import z from "zod";

import { urbanProjectCategorySchema } from "../../urban-project/project-generator/categories";

export const projectGenerationCategorySchema = z.enum([
  ...urbanProjectCategorySchema.exclude(["OTHER"]).options,
  "PHOTOVOLTAIC_POWER_PLANT",
]);

export type ProjectGenerationCategory = z.infer<typeof projectGenerationCategorySchema>;

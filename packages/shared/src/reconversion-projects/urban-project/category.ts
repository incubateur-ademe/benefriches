import z from "zod";

import { urbanProjectTemplateSchema } from "./project-generator/templates";

const urbanProjectCategorySchema = z.enum([...urbanProjectTemplateSchema.options, "OTHER"]);

export type UrbanProjectCategory = z.infer<typeof urbanProjectCategorySchema>;

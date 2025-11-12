import z from "zod";

import { urbanProjectTemplate } from "./project-generator/templates";

const urbanProjectCategorySchema = z.enum([...urbanProjectTemplate.options, "OTHER"]);

export type UrbanProjectCategory = z.infer<typeof urbanProjectCategorySchema>;

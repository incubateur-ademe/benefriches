import z from "zod";

export const urbanProjectCategorySchema = z.enum([
  "PUBLIC_FACILITIES",
  "RESIDENTIAL_TENSE_AREA",
  "RESIDENTIAL_NORMAL_AREA",
  "NEW_URBAN_CENTER",
  "TOURISM_AND_CULTURAL_FACILITIES",
  "OFFICES",
  "INDUSTRIAL_FACILITIES",
  "RENATURATION",
  "OTHER",
]);

export const urbanProjectTemplateSchema = urbanProjectCategorySchema.exclude(["OTHER"]);

export function isUrbanProjectTemplate(template: unknown): template is UrbanProjectTemplate {
  return urbanProjectTemplateSchema.safeParse(template).success;
}

export type UrbanProjectCategory = z.infer<typeof urbanProjectCategorySchema>;
export type UrbanProjectTemplate = z.infer<typeof urbanProjectTemplateSchema>;

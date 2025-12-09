import z from "zod";

export const urbanProjectTemplateSchema = z.enum([
  "PUBLIC_FACILITIES",
  "RESIDENTIAL_TENSE_AREA",
  "RESIDENTIAL_NORMAL_AREA",
  "NEW_URBAN_CENTER",
  "TOURISM_AND_CULTURAL_FACILITIES",
  "OFFICES",
  "INDUSTRIAL_FACILITIES",
  "RENATURATION",
]);

export function isUrbanProjectTemplate(template: unknown): template is UrbanProjectTemplate {
  return urbanProjectTemplateSchema.safeParse(template).success;
}

export type UrbanProjectTemplate = z.infer<typeof urbanProjectTemplateSchema>;

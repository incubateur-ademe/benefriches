import z from "zod";

export const expressProjectCategorySchema = z.enum([
  "PUBLIC_FACILITIES",
  "RESIDENTIAL_TENSE_AREA",
  "RESIDENTIAL_NORMAL_AREA",
  "NEW_URBAN_CENTER",
  "PHOTOVOLTAIC_POWER_PLANT",
  "TOURISM_AND_CULTURAL_FACILITIES",
  "OFFICES",
  "INDUSTRIAL_FACILITIES",
  "RENATURATION",
]);

export type ExpressProjectCategory = z.infer<typeof expressProjectCategorySchema>;

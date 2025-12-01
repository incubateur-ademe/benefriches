import z from "zod";

export const mutabilityUsageSchema = z.enum([
  "residentiel",
  "equipements",
  "culture",
  "tertiaire",
  "industrie",
  "renaturation",
  "photovoltaique",
]);

export type MutabilityUsage = z.infer<typeof mutabilityUsageSchema>;

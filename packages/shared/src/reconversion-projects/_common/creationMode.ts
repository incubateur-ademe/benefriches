import { z } from "zod";

export const reconversionProjectCreationModeSchema = z.enum([
  "express",
  "custom",
  "duplicated",
  "csv-import",
]);
export type ReconversionProjectCreationMode = z.infer<typeof reconversionProjectCreationModeSchema>;

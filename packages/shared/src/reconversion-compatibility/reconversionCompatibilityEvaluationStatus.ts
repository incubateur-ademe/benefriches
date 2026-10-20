import { z } from "zod";

export const reconversionCompatibilityEvaluationStatusSchema = z.enum([
  "started",
  "completed",
  "related_site_created",
]);
export type ReconversionCompatibilityEvaluationStatus = z.infer<
  typeof reconversionCompatibilityEvaluationStatusSchema
>;

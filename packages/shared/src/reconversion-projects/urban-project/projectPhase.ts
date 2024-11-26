import z from "zod";

const urbanProjectPhaseSchema = z.enum([
  "setup",
  "planning",
  "design",
  "construction",
  "completed",
  "unknown",
]);

export const URBAN_PROJECT_PHASE_VALUES = urbanProjectPhaseSchema.options;

export type UrbanProjectPhase = z.infer<typeof urbanProjectPhaseSchema>;

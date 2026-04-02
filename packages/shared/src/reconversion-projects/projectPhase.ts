import z from "zod";

export const projectPhaseSchema = z.enum([
  "setup",
  "planning",
  "design",
  "construction",
  "completed",
  "unknown",
]);

export const PROJECT_PHASE_VALUES = projectPhaseSchema.options;

export type ProjectPhase = z.infer<typeof projectPhaseSchema>;

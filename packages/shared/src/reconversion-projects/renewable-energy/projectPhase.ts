import z from "zod";

const renewableEnergyProjectPhaseSchema = z.enum([
  "setup",
  "design",
  "construction",
  "completed",
  "unknown",
]);

export const RENEWABLE_ENERGY_PROJECT_PHASE_VALUES = renewableEnergyProjectPhaseSchema.options;

export type RenewableEnergyProjectPhase = z.infer<typeof renewableEnergyProjectPhaseSchema>;

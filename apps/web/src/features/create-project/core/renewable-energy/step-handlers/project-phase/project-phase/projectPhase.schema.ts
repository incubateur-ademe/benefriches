import z from "zod";

export const projectPhaseSchema = z.object({
  phase: z.string(),
});

import { urbanProjectPhaseSchema } from "shared";
import z from "zod";

export const projectPhaseSchema = z.object({
  projectPhase: urbanProjectPhaseSchema.optional(),
});

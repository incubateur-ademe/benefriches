import z from "zod";

export const soilsDecontaminationSelectionSchema = z.object({
  decontaminationPlan: z.enum(["partial", "none", "unknown"]),
  decontaminatedSurfaceArea: z.number().optional(),
});

import z from "zod";

export const soilsDecontaminationSurfaceAreaSchema = z.object({
  decontaminatedSurfaceArea: z.number(),
});

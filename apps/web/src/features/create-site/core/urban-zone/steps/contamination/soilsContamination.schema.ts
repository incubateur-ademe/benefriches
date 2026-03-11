import z from "zod";

export const soilsContaminationSchema = z.object({
  hasContaminatedSoils: z.boolean(),
  contaminatedSoilSurface: z.number().optional(),
});

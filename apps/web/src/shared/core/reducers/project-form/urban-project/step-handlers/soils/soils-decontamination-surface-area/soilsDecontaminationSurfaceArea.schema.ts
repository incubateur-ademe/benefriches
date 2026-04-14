import { surfaceAreaSchema } from "shared";
import z from "zod";

export const soilsDecontaminationSurfaceAreaSchema = z.object({
  decontaminatedSurfaceArea: surfaceAreaSchema,
});

import { soilsDistributionSchema } from "shared";
import z from "zod";

export const nonSuitableSoilsSurfaceSchema = z.object({
  nonSuitableSoilsSurfaceAreaToTransform: soilsDistributionSchema,
  baseSoilsDistributionForTransformation: soilsDistributionSchema.optional(),
});

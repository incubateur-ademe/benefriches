import z from "zod";

import { soilsDistributionSchema } from "../shared/soils.schema";

export const nonSuitableSoilsSurfaceSchema = z.object({
  nonSuitableSoilsSurfaceAreaToTransform: soilsDistributionSchema,
  baseSoilsDistributionForTransformation: soilsDistributionSchema.optional(),
});

import z from "zod";

import { soilTypeArraySchema } from "../shared/soils.schema";

export const nonSuitableSoilsSelectionSchema = z.object({
  nonSuitableSoilsToTransform: soilTypeArraySchema,
});

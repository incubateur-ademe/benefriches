import z from "zod";

import { soilsDistributionSchema } from "../shared/soils.schema";

export const customSurfaceAreaAllocationSchema = z.object({
  soilsDistribution: soilsDistributionSchema,
});

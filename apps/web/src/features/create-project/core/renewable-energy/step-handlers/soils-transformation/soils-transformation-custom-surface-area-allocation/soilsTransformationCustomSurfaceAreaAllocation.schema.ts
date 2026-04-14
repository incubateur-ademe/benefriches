import { soilsDistributionSchema } from "shared";
import z from "zod";

export const customSurfaceAreaAllocationSchema = z.object({
  soilsDistribution: soilsDistributionSchema,
});

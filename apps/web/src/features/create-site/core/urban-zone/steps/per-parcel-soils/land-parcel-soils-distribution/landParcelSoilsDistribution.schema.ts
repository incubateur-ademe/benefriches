import { soilsDistributionSchema } from "shared";
import z from "zod";

export const landParcelSoilsDistributionSchema = z.object({
  soilsDistribution: soilsDistributionSchema,
});

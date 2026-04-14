import { soilsDistributionSchema } from "shared";
import z from "zod";

export const publicGreenSpacesSoilsDistributionSchema = z.object({
  publicGreenSpacesSoilsDistribution: soilsDistributionSchema,
});

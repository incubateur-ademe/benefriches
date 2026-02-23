import { soilTypeSchema } from "shared";
import z from "zod";

export const publicGreenSpacesSoilsDistributionSchema = z.object({
  publicGreenSpacesSoilsDistribution: z.partialRecord(soilTypeSchema, z.number()),
});

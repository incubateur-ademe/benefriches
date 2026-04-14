import { soilsDistributionSchema } from "shared";
import z from "zod";

export const spacesSurfaceAreaSchema = z.object({
  spacesSurfaceAreaDistribution: soilsDistributionSchema,
});

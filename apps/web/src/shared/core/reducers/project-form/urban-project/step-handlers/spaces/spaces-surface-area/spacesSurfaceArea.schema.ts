import { soilTypeSchema } from "shared";
import z from "zod";

export const spacesSurfaceAreaSchema = z.object({
  spacesSurfaceAreaDistribution: z.partialRecord(soilTypeSchema, z.number()),
});

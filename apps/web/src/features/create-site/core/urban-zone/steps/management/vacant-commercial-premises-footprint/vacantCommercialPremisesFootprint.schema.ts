import { surfaceAreaSchema } from "shared";
import z from "zod";

export const vacantCommercialPremisesFootprintSchema = z.object({
  surfaceArea: surfaceAreaSchema,
});

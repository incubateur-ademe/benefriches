import z from "zod";

export const vacantCommercialPremisesFootprintSchema = z.object({
  surfaceArea: z.number().nonnegative(),
});

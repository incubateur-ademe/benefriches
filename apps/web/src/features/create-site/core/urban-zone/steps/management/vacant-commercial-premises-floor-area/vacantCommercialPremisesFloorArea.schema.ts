import z from "zod";

export const vacantCommercialPremisesFloorAreaSchema = z.object({
  surfaceArea: z.number().positive(),
});

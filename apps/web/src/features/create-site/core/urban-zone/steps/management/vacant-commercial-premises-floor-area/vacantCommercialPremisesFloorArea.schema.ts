import { surfaceAreaSchema } from "shared";
import z from "zod";

export const vacantCommercialPremisesFloorAreaSchema = z.object({
  surfaceArea: surfaceAreaSchema,
});

import { soilTypeSchema } from "shared";
import z from "zod";

export const spacesSelectionSchema = z.object({
  spacesSelection: z.array(soilTypeSchema),
});

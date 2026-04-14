import type { SoilType } from "shared";
import { soilTypeSchema } from "shared";
import z from "zod";

export const soilTypeArraySchema: z.ZodType<SoilType[]> = z.array(soilTypeSchema);
export const soilsTransformationProjectSchema = z.enum([
  "renaturation",
  "preserveCurrentSoils",
  "custom",
]);

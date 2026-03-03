import type { SoilsDistribution, SoilType } from "shared";
import { soilTypeSchema } from "shared";
import z from "zod";

export const soilsDistributionSchema: z.ZodType<SoilsDistribution> = z.record(
  soilTypeSchema,
  z.number(),
);
export const soilTypeArraySchema: z.ZodType<SoilType[]> = z.array(soilTypeSchema);
export const soilsTransformationProjectSchema = z.enum([
  "renaturation",
  "preserveCurrentSoils",
  "custom",
]);

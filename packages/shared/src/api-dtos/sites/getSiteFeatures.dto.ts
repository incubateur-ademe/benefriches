import z from "zod";

import { addressSchema, siteNatureSchema, urbanZoneLandParcelSchema } from "../../site";
import { soilsDistributionSchema } from "../../soils";

export const getSiteFeaturesResponseDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  nature: siteNatureSchema,
  isExpressSite: z.boolean(),
  owner: z.object({
    name: z.string().optional(),
    structureType: z.string(),
  }),
  tenant: z
    .object({
      name: z.string().optional(),
      structureType: z.string().optional(),
    })
    .optional(),
  hasContaminatedSoils: z.boolean().optional(),
  contaminatedSoilSurface: z.number().optional(),
  soilsDistribution: soilsDistributionSchema,
  surfaceArea: z.number().nonnegative(),
  address: addressSchema,
  accidentsMinorInjuries: z.number().optional(),
  accidentsSevereInjuries: z.number().optional(),
  accidentsDeaths: z.number().optional(),
  yearlyExpenses: z
    .array(
      z.object({
        amount: z.number(),
        purpose: z.string(),
      }),
    )
    .default([]),
  yearlyIncomes: z
    .array(
      z.object({
        amount: z.number(),
        source: z.string(),
      }),
    )
    .default([]),
  fricheActivity: z.string().optional(),
  agriculturalOperationActivity: z.string().optional(),
  naturalAreaType: z.string().optional(),
  description: z.string().optional(),
  urbanZoneType: z.string().optional(),
  landParcels: urbanZoneLandParcelSchema.array().optional(),
  manager: z.object({ structureType: z.string(), name: z.string() }).optional(),
  vacantCommercialPremisesFootprint: z.number().optional(),
  vacantCommercialPremisesFloorArea: z.number().optional(),
  fullTimeJobsEquivalent: z.number().optional(),
});

export type GetSiteFeaturesResponseDto = z.infer<typeof getSiteFeaturesResponseDtoSchema>;
